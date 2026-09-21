import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { spaceActions } from '../../store/spaceSlice';
import { defaultAppearance } from '../../data/mockSpaceData';
import { spaceRepository } from '../../data/spaceRepository';
import { Panel } from '../hud/Panel';
import { ModelPreview } from './ModelPreview';
import { AvatarModel } from './AvatarModel';
import { CharacterCustomizer } from './CharacterCustomizer';
export function CharacterCreator() {
 const reduced=useAppSelector(s=>s.space.reducedMotion);
 const dispatch=useAppDispatch(),[step,setStep]=useState(1),[gender,setGender]=useState<'Male'|'Female'>('Male'),[appearance,setAppearance]=useState(defaultAppearance),[nickname,setNickname]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const finish=async()=>{setBusy(true);const e=await spaceRepository.checkNickname(nickname);setBusy(false);if(e){setError(e);return;}dispatch(spaceActions.createCharacter({gender,nickname,level:1,appearance}));};
 return <Panel title={step===1?'Meet your little self.':step===2?'Make it yours.':'What should we call you?'} eyebrow={`CHARACTER CREATION / 0${step} OF 03`} wide onClose={()=>dispatch(spaceActions.setMode('SPACE'))}>
 <div className="creation-layout"><ModelPreview><AvatarModel key={`${gender}-${appearance.hair}`} gender={gender} appearance={appearance} motion="Idle" animate={!reduced}/></ModelPreview><div className="creation-content"><p className="muted">작은 우주에서 시작하는, 나다운 이야기.</p>
 {step===1?<><h3>Choose your character</h3><div className="choice-row">{(['Male','Female'] as const).map(g=><button key={g} className={`choice ${gender===g?'selected':''}`} aria-pressed={gender===g} onClick={()=>{setGender(g);setAppearance({...appearance,hair:g==='Female'?'Bob':'Short',top:g==='Female'?'#9dcabd':defaultAppearance.top});}}>{g==='Male'?'♂':'♀'}<strong>{g}</strong></button>)}</div><p className="muted">외형과 스타일은 자유롭게 고를 수 있어요.</p></>:step===2?<CharacterCustomizer supportedHairStyles={['Short','Bob']} value={appearance} onChange={setAppearance}/>:<><label className="field-label" htmlFor="space-nickname">YOUR NICKNAME</label><input id="space-nickname" value={nickname} maxLength={16} onChange={e=>{setNickname(e.target.value);setError('');}} placeholder="e.g. StarWanderer" autoComplete="off"/><p className="muted">2~16자 · 한글, 영문, 숫자, 밑줄<br/>Mock 중복 검사가 적용됩니다.</p>{error&&<p role="alert" className="form-error">{error}</p>}<div className="nickname-preview">{nickname||'Your name'} <small>Lv. 1</small></div></>}
 <div className="panel-actions">{step>1&&<button className="quiet-button" onClick={()=>setStep(step-1)}>← Back</button>}<button className="primary-button" disabled={busy} onClick={()=>step<3?setStep(step+1):void finish()}>{step===3?'Create character':'Continue'} <span>↗</span></button></div></div></div>
 </Panel>;
}


