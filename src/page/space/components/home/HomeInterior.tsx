import React from 'react';
import { Block } from './HomeExterior';
import { Html } from '@react-three/drei';
import { FurnitureModel } from './FurnitureModel';
import type { PlacedFurniture } from '../../types/space.types';
import type { ThreeEvent } from '@react-three/fiber';
export function HomeInterior({ placed, editing, selected, onSelect, onMove }: { placed: PlacedFurniture[]; editing: boolean; selected: string | null; onSelect: (id: string) => void; onMove: (x: number,z: number) => void }) {
 const floorMove=(e:ThreeEvent<PointerEvent>)=>{if(editing && selected && e.buttons===1) { e.stopPropagation();onMove(e.point.x,e.point.z); }};
 return <group>
  <Block at={[0,-.12,0]} size={[8,.24,7.5]} color="#dfc9ac"/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,.005,0]} onPointerMove={floorMove}><planeGeometry args={[8,7.5]}/><meshStandardMaterial color="#e0ccb3"/></mesh>
  {Array.from({length:15},(_,i)=><Block key={i} at={[0,.01,-3.5+i*.5]} size={[8,.006,.014]} color="#c5ae95"/>)}
  <Block at={[0,1.4,-3.7]} size={[8,2.8,.16]} color="#ccc7dc"/><Block at={[-4,.7,0]} size={[.16,1.4,7.5]} color="#c0bfce"/><Block at={[4,.7,0]} size={[.16,1.4,7.5]} color="#c0bfce"/>
  <Block at={[2,1.6,-3.59]} size={[1.4,1.2,.04]} color="#8197b7"/><Block at={[2,1.6,-3.55]} size={[.07,1.25,.06]} color="#f4ebdd"/><Block at={[2,1.6,-3.55]} size={[1.4,.07,.06]} color="#f4ebdd"/>
  <Block at={[0,1.2,-3.54]} size={[1.1,.8,.1]} color="#9c877f"/><Block at={[0,1.2,-3.47]} size={[.92,.64,.02]} color="#e9d6b6"/>
  <Html position={[0,2.3,-3.5]} center zIndexRange={[5,0]} style={{pointerEvents:'none'}}><span className="world-sign">✎ YOUR STORIES</span></Html>
  <Block at={[-3,.6,1]} size={[.65,1.2,.5]} color="#b9a2bc"/><Block at={[0,.03,3.3]} size={[1.3,.05,.55]} color="#a2b5a4"/>
  {placed.map(p=><group key={p.id} position={p.position} rotation={[0,p.rotation,0]} scale={p.scale} onPointerDown={e=>{if(editing){e.stopPropagation();onSelect(p.id);}}}>
    <FurnitureModel id={p.furnitureId}/>{editing && selected===p.id && <mesh rotation={[-Math.PI/2,0,0]} position={[0,.025,0]}><ringGeometry args={[.7,.75,40]}/><meshBasicMaterial color="#e7cdff"/></mesh>}
  </group>)}
 </group>;
}
