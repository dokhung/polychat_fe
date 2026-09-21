import React from 'react';
import { Block } from './HomeExterior';
import { Orb } from '../character/Character';
import { furniture } from '../../data/mockSpaceData';
export function FurnitureModel({ id }: { id: string }) {
 const item=furniture.find(i=>i.id===id);if(!item)return null; const c=item.color;
 if(id==='plant')return <><mesh position={[0,.2,0]} castShadow><cylinderGeometry args={[.22,.16,.4,12]}/><meshStandardMaterial color="#d2aa93"/></mesh><Orb at={[0,.65,0]} size={.32} scale={[1,1.4,1]} color={c}/></>;
 if(id==='lamp')return <><Block at={[0,.55,0]} size={[.045,1.1,.045]} color="#b9a58e"/><mesh position={[0,1.12,0]}><coneGeometry args={[.32,.4,24]}/><meshStandardMaterial color={c} emissive={c} emissiveIntensity={.25}/></mesh><Orb at={[0,.04,0]} size={.22} scale={[1,.2,1]} color={c}/></>;
 if(id==='rug')return <mesh position={[0,.035,0]} rotation={[-Math.PI/2,0,0]} scale={[1.4,1,1]} receiveShadow><circleGeometry args={[.9,40]}/><meshStandardMaterial color={c}/></mesh>;
 if(id==='decoration')return <><Orb at={[0,.32,0]} size={.3} color={c}/><mesh position={[0,.32,0]} rotation={[1.2,.2,.2]}><torusGeometry args={[.44,.025,8,32]}/><meshStandardMaterial color="#dfcfab"/></mesh></>;
 if(id==='shelf')return <><Block at={[-.48,.75,0]} size={[.08,1.5,.35]} color={c}/><Block at={[.48,.75,0]} size={[.08,1.5,.35]} color={c}/>{[.12,.65,1.25].map(y=><Block key={y} at={[0,y,0]} size={[1,.08,.35]} color={c}/>)}{[-.3,-.1,.1,.3].map((x,i)=><Block key={x} at={[x,.92,0]} size={[.12,.45,.2]} color={['#9cafbb','#d6a49d','#b5aecc','#afbd99'][i]!}/>)}</>;
 const bed=id==='bed',chair=id==='chair',table=id==='table',w=chair?.65:bed?1.4:1.5,d=bed?2:table?.75:.7;
 return <><Block at={[0,.33,0]} size={[w,.25,d]} color={c}/>{!table&&<Block at={[0,bed?.48:.75,-d/2+.08]} size={[w,bed?.55:.6,.17]} color={c}/>} {bed&&<><Block at={[0,.51,.22]} size={[1.32,.12,1.42]} color="#e9e2cf"/><Orb at={[0,.58,-.6]} size={.4} scale={[1.35,.3,.65]} color="#fff4e7"/></>}{[-1,1].flatMap(x=>[-1,1].map(z=><Block key={`${x}-${z}`} at={[x*(w/2-.12),.12,z*(d/2-.1)]} size={[.09,.25,.09]} color="#987961"/>))}</>;
}
