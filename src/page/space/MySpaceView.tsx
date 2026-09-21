import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getRefreshToken } from '../auth/common/client/authClient';
import { useAppDispatch,useAppSelector } from '../../store/hooks';
import { spaceActions } from './store/spaceSlice';
import { UniverseScene } from './components/universe/UniverseScene';
import { GameHud } from './components/hud/GameHud';
import { CharacterCreator } from './components/character/CharacterCreator';
import { HomeSelector } from './components/home/HomeSelector';
import { FurnitureEditor } from './components/home/FurnitureEditor';
import { FashionShop,FurnitureShop } from './components/shop/Shops';
import { GuestBook,PersonalBoard } from './components/social/SocialPanels';
import { UtilityPanels } from './components/hud/UtilityPanels';
import { isTyping } from './hooks/useCharacterController';
import type { Interaction,PlacedFurniture } from './types/space.types';
import './space.css';
class SceneBoundary extends Component<{children:React.ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="canvas-error" role="alert"><h2>3D 화면을 시작할 수 없어요.</h2><p>브라우저의 하드웨어 가속/WebGL 설정을 확인해 주세요.</p><button onClick={()=>window.location.reload()}>다시 시도</button></div>:this.props.children;}
}
export function MySpaceView() {
 const {profile,mode,panel,editing,notice,reducedMotion}=useAppSelector(s=>s.space),dispatch=useAppDispatch(),[params]=useSearchParams();
 const [near,setNear]=useState<Interaction|null>(null),[transitioning,setTransitioning]=useState(false),[draft,setDraft]=useState<PlacedFurniture[]>([]),[selected,setSelected]=useState<string|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const onNear=useCallback((i:Interaction|null)=>setNear(i),[]);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');dispatch(spaceActions.setReducedMotion(m.matches));const update=()=>dispatch(spaceActions.setReducedMotion(m.matches));m.addEventListener('change',update);return()=>{m.removeEventListener('change',update);if(timer.current)clearTimeout(timer.current);};},[dispatch]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>dispatch(spaceActions.setNotice('')),4500);return()=>clearTimeout(t);},[notice,dispatch]);
 const enter=()=>dispatch(spaceActions.setMode(!profile.character?'CHARACTER_CREATE':!profile.selectedHome?'HOME_SELECT':'PLANET'));
 const interact=useCallback(()=>{
   if(!near||panel||editing||transitioning||!['PLANET','HOME'].includes(mode))return;
   if(near.action==='home'||near.action==='exit') { setTransitioning(true);timer.current=setTimeout(()=>{dispatch(spaceActions.setMode(near.action==='home'?'HOME':'PLANET'));setNear(null);setTransitioning(false);},reducedMotion?80:650); }
   else if(near.action==='fashion')dispatch(spaceActions.setMode('FASHION_SHOP'));
   else if(near.action==='furniture')dispatch(spaceActions.setMode('FURNITURE_SHOP'));
   else if(near.action==='mail')dispatch(spaceActions.setNotice('✉ 우주 우체국: 아직 도착한 편지가 없어요. 오늘도 반짝이는 하루 보내세요!'));
   else dispatch(spaceActions.setPanel(near.action));
 },[near,panel,editing,transitioning,mode,reducedMotion,dispatch]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(!e.repeat&&!isTyping(e.target)&&e.key.toLowerCase()==='e'){e.preventDefault();interact();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[interact]);
 const moveFurniture=useCallback((x:number,z:number)=>{setDraft(items=>items.map(i=>i.id===selected?{...i,position:[Math.round(Math.max(-3,Math.min(3,x))*4)/4,0,Math.round(Math.max(-2.7,Math.min(2.7,z))*4)/4]}:i));},[selected]);
 // Preserve the authenticated production route; development preview uses only local mock data.
 if(!getRefreshToken()&&!(import.meta.env.DEV&&params.get('preview')==='1'))return <Navigate to="/login" replace/>;
 return <main className={`space-world ${mode==='SPACE'?'is-overview':''}`}>
  <div className="nebula nebula-one"/><div className="nebula nebula-two"/><div className="space-grain"/>
  <div className="universe-canvas"><SceneBoundary><UniverseScene onEnter={enter} onNear={onNear} transitioning={transitioning} placed={editing?draft:profile.placedFurniture} selected={selected} onSelect={setSelected} onMove={moveFurniture}/></SceneBoundary></div>
  <GameHud onEnter={enter} near={near} onInteract={interact} onEdit={()=>{setDraft(profile.placedFurniture.map(i=>({...i,position:[...i.position]})));setSelected(null);dispatch(spaceActions.setEditing(true));}}/>
  {mode==='CHARACTER_CREATE'&&<CharacterCreator/>}{mode==='HOME_SELECT'&&<HomeSelector/>}{mode==='FASHION_SHOP'&&<FashionShop/>}{mode==='FURNITURE_SHOP'&&<FurnitureShop/>}
  {panel==='guest'&&<GuestBook/>}{panel==='board'&&<PersonalBoard/>}<UtilityPanels/>
  {editing&&<FurnitureEditor draft={draft} setDraft={setDraft} selected={selected} onSelect={setSelected} onCancel={()=>dispatch(spaceActions.setEditing(false))}/>}
  {notice&&<div className="space-toast glass" role="status">{notice}</div>}<div className={`scene-fade ${transitioning?'active':''}`} aria-hidden="true"/>
 </main>;
}
