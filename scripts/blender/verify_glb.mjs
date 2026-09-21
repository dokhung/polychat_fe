// Uses the same GLTFLoader as R3F/drei. No browser or Blender dependency.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { AnimationMixer, Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const root = new URL('../../', import.meta.url);
for (const gender of ['male', 'female']) {
  const buffer = await fs.readFile(new URL(`public/models/characters/avatar_${gender}.glb`, root));
  const gltf = await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), '');
  const { scene, animations } = gltf;
  scene.updateMatrixWorld(true);
  const meshes = [];
  scene.traverse(o => { if (o.isSkinnedMesh) meshes.push(o); });
  const bounds = new Box3().setFromObject(scene, true);
  assert(Math.abs(bounds.min.y) < .001, 'Soles must rest at Y=0');
  assert(bounds.max.y > 1.4 && bounds.max.y < 1.6, 'Height must be 1.4–1.6');
  let triangles = 0;
  for (const mesh of meshes) {
    const geometry = mesh.geometry;
    triangles += geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
    const weights = geometry.attributes.skinWeight;
    for (let i = 0; i < weights.count; i++) {
      const sum = weights.getX(i) + weights.getY(i) + weights.getZ(i) + weights.getW(i);
      assert(Math.abs(sum - 1) < .001, `${mesh.name}: unnormalized weights`);
    }
  }
  assert(triangles >= 15000 && triangles <= 35000);
  for (const name of ['HairFront', 'HairSide', 'HairBack', 'Top', 'Bottom', 'Shoes']) assert(scene.getObjectByName(name), `Missing ${name}`);
  assert(meshes[0].skeleton.bones.length >= 18);
  for (const name of ['Idle', 'Walk', 'Wave', 'TurnAround']) assert(animations.some(a => a.name === name));
  const mixer = new AnimationMixer(scene);
  const vertex = new Vector3();
  const samples = {};
  for (const clip of animations) {
    mixer.stopAllAction(); mixer.clipAction(clip).reset().play();
    let displacement = 0;
    const initial = meshes.map(m => { m.skeleton.update(); return m.getVertexPosition(0, new Vector3()).clone(); });
    for (let sample = 0; sample <= 8; sample++) {
      mixer.setTime(clip.duration * sample / 8); scene.updateMatrixWorld(true);
      for (let index = 0; index < meshes.length; index++) {
        const mesh = meshes[index]; mesh.skeleton.update();
        for (let i = 0; i < mesh.geometry.attributes.position.count; i += 17) {
          mesh.getVertexPosition(i, vertex).applyMatrix4(mesh.matrixWorld);
          assert(vertex.toArray().every(Number.isFinite), `${clip.name}: invalid skin deformation`);
          assert(vertex.length() < 3, `${clip.name}: exploding mesh`);
        }
        displacement = Math.max(displacement, mesh.getVertexPosition(0, vertex).distanceTo(initial[index]));
      }
    }
    assert(displacement > .001, `${clip.name}: no actual animation`);
    samples[clip.name] = +displacement.toFixed(4);
  }
  console.log(JSON.stringify({ gender, bytes: buffer.length, triangles, drawCalls: meshes.length, height: bounds.max.y, animations: samples }, null, 2));
}
