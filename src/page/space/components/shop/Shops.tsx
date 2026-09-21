import React, { useState } from 'react';
import { useAppDispatch,useAppSelector } from '../../../../store/hooks';
import { spaceActions } from '../../store/spaceSlice';
import { fashion,furniture } from '../../data/mockSpaceData';
import { Panel } from '../hud/Panel';
import { ModelPreview } from '../character/ModelPreview';
import { Character } from '../character/Character';
import { FurnitureModel } from '../home/FurnitureModel';
export function FashionShop() {
 const {profile}=useAppSelector(s=>s.space),dispatch=useAppDispatch(),[tab,setTab]=useState('hair'),[selected,setSelected]=useState(fashion.find(i=>i.slot==='hair')!);
 if(!profile.character)return null;
 const owned=profile.inventory.fashion.some(i=>i.id===selected.id),equipped=profile.character.appearance[selected.slot]===selected.value;
 return <Panel title="Thread & Moon" eyebrow={`FASHION ATELIER / ✦ ${profile.currency.coins.toLocaleString()} STAR COIN`} wide onClose={()=>dispatch(spaceActions.setMode('PLANET'))}><div className="shop-layout"><ModelPreview><Character gender={profile.character.gender} appearance={{...profile.character.appearance,[selected.slot]:selected.value}}/></ModelPreview><div><div className="tabs">{['hair','hairColor','top','bottom','shoes','accessory'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>{setTab(t);setSelected(fashion.find(i=>i.slot===t)!);}}>{t==='hairColor'?'COLOR':t.toUpperCase()}</button>)}</div><div className="catalog">{fashion.filter(i=>i.slot===tab && (i.slot!=='hair' || ['Short','Bob'].includes(i.value))).map(i=><button key={i.id} className={`catalog-item ${selected.id===i.id?'selected':''}`} onClick={()=>setSelected(i)}><span className="item-swatch" style={{background:i.value.startsWith('#')?i.value:'#b7a2d3'}}>{i.slot==='hair'?'⌁':i.slot==='accessory'?'◌':''}</span><strong>{i.name}</strong><small>{profile.inventory.fashion.some(o=>o.id===i.id)?'OWNED':`✦ ${i.price}`}</small></button>)}</div><div className="purchase-bar"><div><strong>{selected.name}</strong><p className="muted">{owned?'Your collection':`✦ ${selected.price} Star Coin`}</p></div><button className="primary-button" disabled={equipped || (!owned&&profile.currency.coins<selected.price)} onClick={()=>dispatch(spaceActions.buyFashion(selected.id))}>{equipped?'EQUIPPED':owned?'EQUIP':'BUY & EQUIP'}</button></div></div></div></Panel>;
}
export function FurnitureShop() {
 const {profile}=useAppSelector(s=>s.space),dispatch=useAppDispatch(),[selected,setSelected]=useState(furniture[0]!);
 const owned=profile.inventory.furniture.some(i=>i.furnitureId===selected.id);
 return <Panel title="Little Living" eyebrow={`FURNITURE & LITTLE JOYS / ✦ ${profile.currency.coins.toLocaleString()}`} wide onClose={()=>dispatch(spaceActions.setMode('PLANET'))}><div className="shop-layout"><ModelPreview home><FurnitureModel id={selected.id}/></ModelPreview><div><div className="catalog">{furniture.map(i=><button key={i.id} className={`catalog-item ${selected.id===i.id?'selected':''}`} onClick={()=>setSelected(i)}><span className="furniture-symbol" style={{color:i.color}}>{i.thumbnail}</span><strong>{i.name}</strong><small>{profile.inventory.furniture.some(o=>o.furnitureId===i.id)?'OWNED':`✦ ${i.price}`} · {i.category}</small></button>)}</div><div className="purchase-bar"><span>집의 Edit Room에서 배치할 수 있어요.</span><button className="primary-button" disabled={owned||profile.currency.coins<selected.price} onClick={()=>dispatch(spaceActions.buyFurniture(selected.id))}>{owned?'OWNED':`BUY · ${selected.price}`}</button></div></div></div></Panel>;
}
