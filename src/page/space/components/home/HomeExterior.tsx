import React from 'react';
import type { HomeType, Vec3 } from '../../types/space.types';
import { Orb } from '../character/Character';
export function Block({ at, size, color, rotation = 0 }: { at: Vec3; size: Vec3; color: string; rotation?: number }) { return <mesh position={at} rotation={[0, rotation, 0]} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.82} /></mesh>; }
export function HomeExterior({ type = 'cottage', doorOpen = false }: { type?: HomeType; doorOpen?: boolean }) {
 return <group>
   {type === 'capsule' ? <><Orb at={[0, .7, 0]} size={1} scale={[1, .85, .8]} color="#d2e1e6" /><mesh position={[0, .67, .7]}><circleGeometry args={[.39, 32]} /><meshStandardMaterial color="#59899c" metalness={.3} /></mesh><mesh position={[0, .67, .71]}><torusGeometry args={[.4, .055, 8, 32]} /><meshStandardMaterial color="#eee9d8" /></mesh></> : <>
     <Block at={[0, .65, 0]} size={[1.85, 1.3, 1.5]} color={type === 'modern' ? '#e9e8e4' : '#ecd8b5'} />
     {type === 'cottage' ? <><mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.52, .95, 4]} /><meshStandardMaterial color="#b37f8a" /></mesh><Block at={[.56, 1.67, -.3]} size={[.25, .65, .26]} color="#d0a088" /><Orb at={[.56, 2.12, -.3]} size={.14} color="#d2cce2" /><Orb at={[.62, 2.4, -.34]} size={.2} color="#d2cce2" /></> : <Block at={[0, 1.35, 0]} size={[2.06, .18, 1.7]} color="#d0d9df" />}
     <Block at={[.51, .8, .76]} size={[type === 'modern' ? .63 : .4, .46, .03]} color="#7cbbbc" /><Block at={[.51, .8, .79]} size={[.04, .49, .04]} color="#fff0cf" /><Block at={[.51, .8, .79]} size={[.44, .04, .04]} color="#fff0cf" />
   </>}
   <group position={[-.46, .43, .78]} rotation={[0, doorOpen ? -1.3 : 0, 0]}><Block at={[.19, 0, 0]} size={[.4, .85, .09]} color="#87718e" /><Orb at={[.32, 0, .075]} size={.035} color="#ffdc9d" /></group>
   <Block at={[-.25, .045, .97]} size={[.85, .09, .35]} color="#dbcabd" />
 </group>;
}
