import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3, MathUtils } from 'three';
import { useAppSelector } from '../../../../store/hooks';
import { useCharacterController } from '../../hooks/useCharacterController';
import { constrainPosition, nearestInteraction, collidesOutside } from '../../hooks/worldMovement';
import { planetInteractions, homeInteractions } from '../../data/mockSpaceData';
import { Character } from './Character';
import type { Interaction, Motion } from '../../types/space.types';
export function CharacterController({ inside, active, onNear, transitioning }: { inside: boolean; active: boolean; onNear: (i: Interaction | null) => void; transitioning: boolean }) {
 const actor = useRef<Group>(null), currentNear = useRef<string | null>(null), input = useCharacterController(active), { gl } = useThree();
 const character = useAppSelector(s=>s.space.profile.character), emote = useAppSelector(s=>s.space.motion), reduced = useAppSelector(s=>s.space.reducedMotion);
 const [motion,setMotion] = useState<Motion>('Idle');
 const movement = useRef<Motion>('Idle'), orbit = useRef({ yaw: 0, pitch: .58, distance: 6, dragging: false, x: 0, y: 0 });
 const target = useRef(new Vector3()), desired = useRef(new Vector3());
 useEffect(() => { if (actor.current) { actor.current.position.set(0,0,inside ? 2.1 : 2.6); actor.current.rotation.y=Math.PI; } currentNear.current = null; onNear(null); },[inside,onNear]);
 useEffect(() => {
   if (!active) return;
   const canvas = gl.domElement, o = orbit.current;
   const down = (e: PointerEvent) => { o.dragging = true; o.x=e.clientX; o.y=e.clientY; canvas.setPointerCapture(e.pointerId); };
   const move = (e: PointerEvent) => { if (!o.dragging) return; o.yaw -= (e.clientX-o.x)*.006; o.pitch=MathUtils.clamp(o.pitch+(e.clientY-o.y)*.004,.22,1.15); o.x=e.clientX;o.y=e.clientY; };
   const up = () => { o.dragging=false; };
   const wheel = (e: WheelEvent) => { e.preventDefault(); o.distance=MathUtils.clamp(o.distance+e.deltaY*.007,3,10); };
   canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',up);canvas.addEventListener('wheel',wheel,{passive:false});
   return () => { canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);canvas.removeEventListener('wheel',wheel);o.dragging=false; };
 },[active,gl]);
 useFrame(({camera},dt) => {
   const a=actor.current; if (!a) return;
   const step=Math.min(dt,.04), controls=input(), moving=active && !!(controls.x || controls.z), o=orbit.current;
   if (moving) {
     const length=Math.hypot(controls.x,controls.z), speed=(controls.run?2.8:1.65)*step;
     const dx=(controls.x*Math.cos(o.yaw)+controls.z*Math.sin(o.yaw))/length, dz=(-controls.x*Math.sin(o.yaw)+controls.z*Math.cos(o.yaw))/length;
     const [x,z]=constrainPosition(a.position.x+dx*speed,a.position.z+dz*speed,inside);
     if (inside || !collidesOutside(x,z)) { a.position.x=x;a.position.z=z; }
     const angle=Math.atan2(dx,dz); a.rotation.y += Math.atan2(Math.sin(angle-a.rotation.y),Math.cos(angle-a.rotation.y))*(1-Math.exp(-12*step));
   }
   const next: Motion = moving ? controls.run ? 'Run':'Walk' : emote;
   if (movement.current!==next) { movement.current=next;setMotion(next); }
   const nearest=nearestInteraction(a.position.x,a.position.z,inside?homeInteractions:planetInteractions);
   if (currentNear.current !== (nearest?.interactionId ?? null)) { currentNear.current=nearest?.interactionId ?? null;onNear(nearest); }
   target.current.set(a.position.x,a.position.y+.65,a.position.z);
   if (transitioning) { desired.current.set(0,1.7,inside ? 4 : .2); target.current.set(0,.8,inside ? 3.4 : -2.4); }
   else desired.current.set(a.position.x+Math.sin(o.yaw)*o.distance*Math.cos(o.pitch),a.position.y+o.distance*Math.sin(o.pitch)+.6,a.position.z+Math.cos(o.yaw)*o.distance*Math.cos(o.pitch));
   camera.position.lerp(desired.current,reduced ? 1 : 1-Math.exp(-4*step)); camera.lookAt(target.current);
 });
 if (!character) return null;
 return <group ref={actor} position={[0,0,inside?2.1:2.6]}><Character gender={character.gender} appearance={character.appearance} motion={motion} animate={!reduced} /></group>;
}
