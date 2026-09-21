import React, { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Mesh, MeshStandardMaterial, SkinnedMesh } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CharacterAppearance, Motion } from '../../types/space.types';

const urls = { Male: '/models/characters/avatar_male.glb?v=3', Female: '/models/characters/avatar_female.glb?v=3' } as const;

export function AvatarModel({ gender, appearance, motion = 'Idle', animate = true }: {
  gender: 'Male' | 'Female'; appearance: CharacterAppearance; motion?: Motion; animate?: boolean;
}) {
  const source = useGLTF(urls[gender]);
  const hairSource = useGLTF(urls[appearance.hair === 'Short' ? 'Male' : 'Female']);
  const root = useRef<Group>(null);
  const { scene, materials } = useMemo(() => {
    // Each instance owns its skeleton and materials; cached geometries stay shared.
    const scene = clone(source.scene);
    const materials = new Map<MeshStandardMaterial, MeshStandardMaterial>();
    let skeleton: SkinnedMesh['skeleton'] | undefined;
    scene.traverse(object => {
      if ((object as SkinnedMesh).isSkinnedMesh) skeleton ??= (object as SkinnedMesh).skeleton;
    });
    const oldHair: Group[] = [];
    scene.traverse(object => { if (/^Hair(Front|Side|Back)$/.test(object.name)) oldHair.push(object as Group); });
    oldHair.forEach(object => object.removeFromParent());
    const replacement = clone(hairSource.scene);
    const newHair: Group[] = [];
    replacement.traverse(object => { if (/^Hair(Front|Side|Back)$/.test(object.name)) newHair.push(object as Group); });
    newHair.forEach(object => {
      object.traverse(child => {
        if ((child as SkinnedMesh).isSkinnedMesh && skeleton) (child as SkinnedMesh).skeleton = skeleton;
      });
      scene.add(object);
    });
    scene.traverse(object => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      mesh.castShadow = true; mesh.receiveShadow = true;
      const copy = (original: MeshStandardMaterial) => {
        if (!materials.has(original)) materials.set(original, original.clone());
        return materials.get(original)!;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => copy(m as MeshStandardMaterial)) : copy(mesh.material as MeshStandardMaterial);
    });
    return { scene, materials };
  }, [source.scene, hairSource.scene]);
  const { actions } = useAnimations(source.animations, scene);
  useEffect(() => {
    const palette: Record<string, string> = { Skin: appearance.skin, Hair: appearance.hairColor, Eyes: appearance.eyes, Top: appearance.top, Bottom: appearance.bottom, Shoes: appearance.shoes };
    materials.forEach(material => { const color = palette[material.name]; if (color) material.color.set(color); });
    scene.traverse(object => {
      const mesh = object as Mesh;
      const index = mesh.morphTargetDictionary?.Soft;
      if (index !== undefined && mesh.morphTargetInfluences) mesh.morphTargetInfluences[index] = appearance.face === 'soft' ? 1 : 0;
    });
  }, [appearance, materials, scene]);
  useEffect(() => {
    const action = actions[motion] ?? actions.Idle;
    if (!action) return;
    action.reset().fadeIn(.18).play(); action.paused = !animate;
    return () => { action.fadeOut(.18); };
  }, [actions, motion, animate]);
  useEffect(() => () => {
    materials.forEach(material => material.dispose());
    const skeletons = new Set<SkinnedMesh['skeleton']>();
    scene.traverse(object => { if ((object as SkinnedMesh).isSkinnedMesh) skeletons.add((object as SkinnedMesh).skeleton); });
    skeletons.forEach(skeleton => skeleton.dispose());
  }, [materials, scene]);
  useEffect(() => { root.current?.scale.setScalar(animate ? .94 : 1); }, [gender, animate]);
  useFrame((_, dt) => {
    if (root.current) root.current.scale.setScalar(MathUtils.damp(root.current.scale.x, 1, 14, Math.min(dt, .1)));
  });
  return <group ref={root}><primitive object={scene} dispose={null} />
    {appearance.accessory === 'halo' && <mesh position={[0, 1.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[.24, .025, 8, 32]} />
      <meshStandardMaterial color="#ffe6a0" emissive="#b88c32" emissiveIntensity={.3} />
    </mesh>}
  </group>;
}
useGLTF.preload(urls.Male);
useGLTF.preload(urls.Female);
