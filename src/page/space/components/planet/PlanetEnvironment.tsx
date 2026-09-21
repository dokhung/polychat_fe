import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useAppSelector } from '../../../../store/hooks';
import { HomeExterior, Block } from '../home/HomeExterior';
import { Orb, Character } from '../character/Character';
export function Tree({ x, z, s = 1, pink = false }: { x: number; z: number; s?: number; pink?: boolean }) { return <group position={[x, 0, z]} scale={s}><mesh position={[0, .48, 0]} castShadow><cylinderGeometry args={[.075, .12, .95, 7]} /><meshStandardMaterial color="#8e7669" /></mesh><Orb at={[0, 1.05, 0]} size={.58} scale={[1, 1.25, 1]} color={pink ? '#d8a9c0' : '#86b99b'} /><Orb at={[-.27, .95, .12]} size={.33} color={pink ? '#e8bbcd' : '#abd1ac'} /></group>; }
function Sign({ children, x, z }: { children: React.ReactNode; x: number; z: number }) { return <Html position={[x, 2.55, z]} center zIndexRange={[5,0]} style={{ pointerEvents: 'none' }}><span className="world-sign">{children}</span></Html>; }
export function PlanetEnvironment({ overview, onEnter, doorOpen }: { overview: boolean; onEnter: () => void; doorOpen: boolean }) {
 const profile = useAppSelector(s => s.space.profile), [hover, setHover] = useState(false);
 const enter = (e: ThreeEvent<MouseEvent>) => { if (overview && e.delta < 5) { e.stopPropagation(); onEnter(); } };
 return <group onClick={enter} onPointerOver={() => overview && setHover(true)} onPointerOut={() => setHover(false)}>
   <mesh scale={[1, .77, 1]} receiveShadow><sphereGeometry args={[5.6, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#768b9d" roughness={1} /></mesh>
   <mesh position={[0, -.06, 0]} receiveShadow><cylinderGeometry args={[5.6, 5.58, .16, 80]} /><meshStandardMaterial color={hover ? '#b8d9b3' : '#a3c9a3'} emissive="#9ac6a3" emissiveIntensity={hover ? .18 : .02} /></mesh>
   <mesh position={[0, .025, .5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[1.55, 48]} /><meshStandardMaterial color="#e3d7bc" /></mesh>
   <Block at={[0, .012, -1.25]} size={[.8, .04, 2.6]} color="#e3d7bc" />
   <Block at={[0, .01, -.05]} size={[6.7, .035, .68]} color="#e3d7bc" />
   {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.sin(i * .5) * .2, .035, 1.9 + i * .5]} rotation={[-Math.PI / 2, 0, .2]}><circleGeometry args={[.21, 6]} /><meshStandardMaterial color="#e5dac5" /></mesh>)}
   {[[-3.7,-2.4,1],[-2.8,-3.7,1.15],[2.8,-3.6,1.1],[4,-2.2,.85],[-4.6,.7,.9],[-3.8,2.7,.8],[3.8,2.7,.7],[-1.5,4,.7]].map(([x,z,s], i) => <Tree key={i} x={x!} z={z!} s={s} pink={i % 3 === 0} />)}
   {Array.from({ length: 32 }, (_, i) => { const angle = i * 2.399, r = 3.7 + Math.sin(i * 7) * .8; return <group key={i} position={[Math.cos(angle) * r, .05, Math.sin(angle) * r]}><Orb at={[0, .05, 0]} size={.08} color={['#f6e4ae','#ebbad2','#dfdbf0'][i % 3]!} /><Orb at={[.08, .025, .04]} size={.055} color="#6eaa87" /></group>; })}
   {[[-4,1.7],[4.6,-.7],[1.8,4.4],[-2,-4.6]].map(([x,z],i) => <Orb key={i} at={[x!, .08, z!]} size={.25} scale={[1,.55,.8]} color="#a5b1ac" />)}
   <group position={[-2.1,0,2.3]} rotation={[0,.4,0]}><Block at={[0,.36,0]} size={[1.1,.12,.38]} color="#bb9777" /><Block at={[0,.65,-.18]} size={[1.1,.42,.08]} color="#d3b090" />{[-.4,.4].map(x => <Block key={x} at={[x,.16,0]} size={[.08,.35,.33]} color="#697c75" />)}</group>
   {profile.selectedHome && <group position={profile.selectedHome.position} rotation={[0,profile.selectedHome.rotation,0]}><HomeExterior type={profile.selectedHome.homeType} doorOpen={doorOpen} /><Sign x={0} z={0}>⌂ MY HOME</Sign></group>}
   {profile.character && <>
     <group position={[-3.35,0,-.85]}><Block at={[0,.58,0]} size={[1.35,1.16,1.15]} color="#e5bfd0" /><mesh position={[0,1.23,0]} rotation={[0,Math.PI / 4,0]} castShadow><coneGeometry args={[1.13,.65,4]} /><meshStandardMaterial color="#ad8eaf" /></mesh><Block at={[0,.65,.59]} size={[.75,.6,.03]} color="#846e9b" /><Block at={[0,1,.75]} size={[1.5,.12,.45]} color="#f4dce4" /><Sign x={0} z={0}>✧ THREAD & MOON</Sign></group>
     <group position={[3.35,0,-.85]}><Block at={[0,.57,0]} size={[1.4,1.14,1.15]} color="#e7c99e" /><Block at={[0,1.2,0]} size={[1.65,.2,1.4]} color="#9baea1" /><Block at={[0,.65,.59]} size={[.8,.6,.03]} color="#9e8e7c" /><Sign x={0} z={0}>♧ LITTLE LIVING</Sign></group>
     <group position={[2.8,0,2.5]}><Block at={[0,.45,0]} size={[.08,.9,.09]} color="#9a816e" /><Block at={[0,.97,0]} size={[.8,.6,.1]} color="#ddbd98" /><Block at={[0,.98,.065]} size={[.6,.38,.02]} color="#fff0d1" /></group>
     <group position={[-1.4,0,-1.1]}><Block at={[0,.35,0]} size={[.09,.7,.09]} color="#8b776e" /><Block at={[0,.8,0]} size={[.34,.3,.4]} color="#b08fa7" /></group>
     {overview && <group position={[0,.05,1.1]} rotation={[0,.3,0]}><Character gender={profile.character.gender} appearance={profile.character.appearance} motion="Wave" /></group>}
   </>}
   <mesh position={[0,-1.4,0]} rotation={[Math.PI / 2,.14,0]}><torusGeometry args={[6.7,.012,6,120]} /><meshBasicMaterial color="#a7a0d7" transparent opacity={.35} /></mesh>
 </group>;
}
