import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PCFShadowMap } from 'three';
import { useAppSelector } from '../../../../store/hooks';
import { StarField } from './StarField';
import { PlanetEnvironment } from '../planet/PlanetEnvironment';
import { CharacterController } from '../character/CharacterController';
import { HomeInterior } from '../home/HomeInterior';
import type { Interaction, PlacedFurniture } from '../../types/space.types';
import { canvasEvents } from './canvasEvents';
function OverviewFraming() {
 const {camera,size}=useThree();
 useEffect(()=>{const scale=Math.max(1,.95/(size.width/size.height));camera.position.set(13*scale,10*scale,16*scale);},[camera,size.width,size.height]);
 return null;
}
export function UniverseScene({ onEnter, onNear, transitioning, placed, selected, onSelect, onMove }: { onEnter:()=>void; onNear:(i:Interaction|null)=>void; transitioning:boolean; placed:PlacedFurniture[]; selected:string|null; onSelect:(id:string)=>void; onMove:(x:number,z:number)=>void }) {
 const {mode,panel,editing,reducedMotion}=useAppSelector(s=>s.space), overview=['SPACE','CHARACTER_CREATE','HOME_SELECT'].includes(mode), inside=mode==='HOME';
 return <Canvas events={canvasEvents} shadows={{ type: PCFShadowMap }} dpr={[1,1.5]} camera={{position:[13,10,16],fov:42,near:.1,far:160}} gl={{antialias:true,alpha:true}} aria-label="Interactive 3D planet world">
   <ambientLight intensity={1.05}/><hemisphereLight args={['#d5d6fc','#8c9c98',1.7]}/><directionalLight position={[-6,12,6]} intensity={2.7} color="#fff0d2" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-.0005}/><directionalLight position={[7,5,-7]} intensity={1.7} color="#bab0f5"/>
   <Suspense fallback={null}><StarField/>
   {inside?<HomeInterior placed={placed} editing={editing} selected={selected} onSelect={onSelect} onMove={onMove}/>:<PlanetEnvironment overview={overview} onEnter={onEnter} doorOpen={transitioning}/>}
   {!overview && <CharacterController inside={inside} active={!panel && !editing && !transitioning && (mode==='PLANET'||mode==='HOME')} onNear={onNear} transitioning={transitioning}/>}
   {overview && <><OverviewFraming/><OrbitControls makeDefault target={[0,-.5,0]} enablePan={false} minDistance={13} maxDistance={55} minPolarAngle={.35} maxPolarAngle={1.35} autoRotate={!reducedMotion && mode==='SPACE'} autoRotateSpeed={.22}/></>}
   </Suspense>
 </Canvas>;
}
