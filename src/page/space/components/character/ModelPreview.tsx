import React, { Component, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useAppSelector } from '../../../../store/hooks';
import { canvasEvents } from '../universe/canvasEvents';
class PreviewBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div role="alert" className="canvas-error">캐릭터를 불러오지 못했어요. <button onClick={()=>window.location.reload()}>다시 시도</button></div>:this.props.children;}
}
export function ModelPreview({children, home=false}:{children:React.ReactNode;home?:boolean}) {
 const reduced=useAppSelector(s=>s.space.reducedMotion);
 return <div className="model-preview"><PreviewBoundary><Canvas events={canvasEvents} shadows dpr={[1,1.5]}>
 <PerspectiveCamera makeDefault position={home?[3,2.4,4]:[0,1.12,3.65]} fov={32}/>
 <ambientLight intensity={.65}/>
 <directionalLight position={[2.5,4,4]} intensity={2.5} color="#fff2e4"/>
 <directionalLight position={[-3,1.8,2]} intensity={1.15} color="#dbe8ff"/>
 <directionalLight position={[1.5,2.8,-3]} intensity={2.8} color="#cbb5ff"/>
 <Suspense fallback={<Html center><div role="status" style={{whiteSpace:'nowrap',color:'#ded6ef'}}>캐릭터를 불러오는 중…</div></Html>}>
 {children}
 {!home&&<ContactShadows position={[0,-.005,0]} opacity={.3} scale={3} blur={2.8} far={2} resolution={256} color="#514366"/>}
 </Suspense>
 <OrbitControls target={[0,home?.85:.78,0]} enablePan={false} enableZoom={false} minPolarAngle={home?undefined:Math.PI/2-.093} maxPolarAngle={home?undefined:Math.PI/2-.093} autoRotate={home&&!reduced} autoRotateSpeed={1.2}/>
 </Canvas></PreviewBoundary><span>DRAG TO ROTATE ↔</span></div>;
}
