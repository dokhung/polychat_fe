import React, { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from '../../../../store/hooks';
import { spaceActions } from '../../store/spaceSlice';
import { furniture } from '../../data/mockSpaceData';
import { isTyping } from '../../hooks/useCharacterController';
import type { PlacedFurniture } from '../../types/space.types';
export function FurnitureEditor({draft,setDraft,selected,onSelect,onCancel}:{draft:PlacedFurniture[];setDraft:React.Dispatch<React.SetStateAction<PlacedFurniture[]>>;selected:string|null;onSelect:(id:string|null)=>void;onCancel:()=>void}) {
 const dispatch=useAppDispatch(),owned=useAppSelector(s=>s.space.profile.inventory.furniture);
 const rotate=(direction:number)=>setDraft(items=>items.map(i=>i.id===selected?{...i,rotation:i.rotation+direction*Math.PI/4}:i));
 const remove=()=>{setDraft(items=>items.filter(i=>i.id!==selected));onSelect(null);};
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(isTyping(e.target))return;if(e.key.toLowerCase()==='q')rotate(-1);if(e.key.toLowerCase()==='e')rotate(1);if(e.key==='Delete'){e.preventDefault();remove();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);});
 return <aside className="furniture-editor glass"><p className="space-kicker">MAKE ROOM FOR YOU</p><h3>Edit your room</h3><p className="muted">가구 선택 → 바닥을 드래그해 이동<br/>Q / E 회전 · Delete 제거</p><div className="editor-items">{owned.map(o=>{const item=furniture.find(i=>i.id===o.furnitureId);if(!item)return null;const placed=draft.some(i=>i.furnitureId===item.id);return <button key={item.id} disabled={placed} onClick={()=>{const id=crypto.randomUUID();setDraft(items=>[...items,{id,furnitureId:item.id,position:[0,0,0],rotation:0,scale:1}]);onSelect(id);}}>{item.thumbnail} {item.name}<small>{placed?'Placed':'+ Place'}</small></button>;})}</div><div className="editor-tools"><button disabled={!selected} onClick={()=>rotate(-1)}>↶ Q</button><button disabled={!selected} onClick={()=>rotate(1)}>E ↷</button><button disabled={!selected} onClick={remove}>Remove</button></div><div className="panel-actions"><button className="quiet-button" onClick={onCancel}>Cancel</button><button className="primary-button" onClick={()=>dispatch(spaceActions.saveFurniture(draft))}>Save room</button></div></aside>;
}
