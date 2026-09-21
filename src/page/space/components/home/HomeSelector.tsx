import React, { useState } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { spaceActions } from '../../store/spaceSlice';
import type { HomeType } from '../../types/space.types';
import { Panel } from '../hud/Panel';
import { ModelPreview } from '../character/ModelPreview';
import { HomeExterior } from './HomeExterior';
export function HomeSelector() {
 const [selected,setSelected]=useState<HomeType>('cottage'),dispatch=useAppDispatch();
 return <Panel title="A place to call home." eyebrow="CHOOSE YOUR HOME / A LITTLE GIFT FROM US" wide><p className="muted">세 가지 작은 집 중 마음이 머무는 곳을 골라 주세요. 첫 집은 무료예요.</p><div className="home-choices">{([{id:'cottage',name:'Cozy Cottage',desc:'따뜻한 나무와 작은 굴뚝'}, {id:'modern',name:'Modern Cube',desc:'햇살 가득한 미니멀 라이프'}, {id:'capsule',name:'Space Capsule',desc:'별을 여행하는 당신의 쉼터'}] as const).map((h,i)=><div key={h.id} className={`home-choice ${selected===h.id?'selected':''}`}><ModelPreview home><HomeExterior type={h.id}/></ModelPreview><button onClick={()=>setSelected(h.id)} aria-pressed={selected===h.id}><small>0{i+1} / FREE</small><h3>{h.name}</h3><p>{h.desc}</p><span>{selected===h.id?'✓ Selected':'Select home'}</span></button></div>)}</div><div className="panel-actions"><button className="primary-button" onClick={()=>dispatch(spaceActions.chooseHome(selected))}>Bring my planet to life <span>↗</span></button></div></Panel>;
}
