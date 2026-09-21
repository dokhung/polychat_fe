import React from 'react';
import { useAppDispatch,useAppSelector } from '../../../../store/hooks';
import { spaceActions } from '../../store/spaceSlice';
import { furniture,fashion } from '../../data/mockSpaceData';
import { Panel } from './Panel';
import { ModelPreview } from '../character/ModelPreview';
import { Character } from '../character/Character';
export function UtilityPanels() {
 const {profile,panel,reducedMotion}=useAppSelector(s=>s.space),dispatch=useAppDispatch(),close=()=>dispatch(spaceActions.setPanel(null));
 if(panel==='settings')return <Panel title="A little more comfortable." eyebrow="SETTINGS" onClose={close}><label className="toggle-setting"><span>Reduce motion<small>자동 회전과 긴 카메라 이동을 줄입니다.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>dispatch(spaceActions.setReducedMotion(e.target.checked))}/></label><p className="muted">WASD / 방향키: 이동 · Shift: 달리기<br/>마우스 드래그: 둘러보기 · 휠: 확대/축소<br/>E: 가까운 오브젝트와 상호작용<br/>Esc: 패널 닫기</p><div className="prototype-note">LOCAL PROTOTYPE<p>캐릭터, 집, 구매, 가구와 게시글은 이 브라우저에 저장됩니다. 실제 다른 유저와 연결되지 않습니다.</p></div></Panel>;
 if(panel==='character'&&profile.character)return <Panel title={profile.character.nickname} eyebrow={`YOUR CHARACTER / LV. ${profile.character.level}`} onClose={close}><ModelPreview><Character gender={profile.character.gender} appearance={profile.character.appearance} motion="Wave"/></ModelPreview><p className="muted">행성의 Thread & Moon에 방문해 새로운 스타일을 만나보세요.</p></Panel>;
 if(panel==='inventory')return <Panel title="Your little collection." eyebrow={`INVENTORY / ✦ ${profile.currency.coins}`} onClose={close}><h3>Furniture</h3><div className="inventory-list">{profile.inventory.furniture.map(o=><p key={o.furnitureId}><span>{furniture.find(i=>i.id===o.furnitureId)?.name}</span><small>{profile.placedFurniture.some(i=>i.furnitureId===o.furnitureId)?'PLACED':'READY TO PLACE'}</small></p>)}</div><h3>Wardrobe</h3><div className="inventory-list">{profile.inventory.fashion.map(o=><p key={o.id}>{fashion.find(i=>i.id===o.id)?.name}<small>OWNED</small></p>)}</div></Panel>;
 return null;
}
