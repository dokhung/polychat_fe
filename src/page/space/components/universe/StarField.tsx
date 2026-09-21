import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import type { Group } from 'three';
import { useAppSelector } from '../../../../store/hooks';
export function StarField() {
 const meteor=useRef<Group>(null), sky=useRef<Group>(null), reduced=useAppSelector(s=>s.space.reducedMotion);
 const dust=useMemo(()=>{ const p=new Float32Array(900*3);let seed=74291;for(let i=0;i<p.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;p[i]=((seed>>>0)/4294967296-.5)*76;}return p; },[]);
 useFrame(({clock,pointer},dt)=>{if(meteor.current && !reduced) { const t=(clock.elapsedTime*.045)%1;meteor.current.position.set(26-t*60,16-t*8,-20);meteor.current.visible=t<.65; }if(sky.current&&!reduced){sky.current.rotation.y+=(pointer.x*.012-sky.current.rotation.y)*Math.min(1,dt*2);sky.current.rotation.x+=(pointer.y*.008-sky.current.rotation.x)*Math.min(1,dt*2);}});
 return <group ref={sky}><Stars radius={45} depth={30} count={2200} factor={3.5} saturation={.2} fade speed={reduced?0:.15}/>
   <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[dust,3]} /></bufferGeometry><pointsMaterial size={.075} color="#d3b7ee" transparent opacity={.8} sizeAttenuation /></points>
   <group position={[-17,5,-15]} rotation={[.4,0,-.35]}><mesh><sphereGeometry args={[1.1,24,20]} /><meshStandardMaterial color="#a296bc" /></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.8,.07,8,64]} /><meshStandardMaterial color="#c8b6cc" /></mesh></group>
   <mesh position={[18,8,-25]}><sphereGeometry args={[1.5,24,20]} /><meshStandardMaterial color="#829cb7" /></mesh>
   <group ref={meteor}><mesh rotation={[0,0,-1.15]}><cylinderGeometry args={[0,.035,2.4,6]} /><meshBasicMaterial color="#e4d5ff" transparent opacity={.6} /></mesh></group>
 </group>;
}
