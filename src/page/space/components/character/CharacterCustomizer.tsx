import React from 'react';
import type { CharacterAppearance } from '../../types/space.types';
import { hairColors,hairStyles } from '../../data/mockSpaceData';
export function CharacterCustomizer({value,onChange,supportedHairStyles=hairStyles}:{value:CharacterAppearance;onChange:(a:CharacterAppearance)=>void;supportedHairStyles?:string[]}) {
 const update=(slot:keyof CharacterAppearance,v:string)=>onChange({...value,[slot]:v});
 return <div className="appearance-fields"><label>FACE<select value={value.face} onChange={e=>update('face',e.target.value)}><option value="round">Round</option><option value="soft">Soft</option></select></label><label>HAIR<select value={value.hair} onChange={e=>update('hair',e.target.value)}>{supportedHairStyles.map(h=><option key={h}>{h}</option>)}</select></label>
 {([['skin',['#efc4a6','#d69e7b','#996c53','#704d41']],['eyes',['#39314f','#699788','#718fbd']],['hairColor',hairColors],['top',['#b5a4ed','#9dcabd','#efad9c']],['bottom',['#484867','#c3b49a','#789e9c']],['shoes',['#fff2de','#997ab2','#534b68']]] as [keyof CharacterAppearance,string[]][]).map(([slot,colors])=><fieldset key={slot}><legend>{({skin:'SKIN',eyes:'EYES',hairColor:'HAIR COLOR',top:'TOP',bottom:'BOTTOM',shoes:'SHOES'} as Record<string,string>)[slot]}</legend><div className="swatches">{colors.map(c=><button type="button" key={c} aria-label={`${slot} ${c}`} aria-pressed={value[slot]===c} style={{background:c}} className={value[slot]===c?'selected':''} onClick={()=>update(slot,c)}/>)}</div></fieldset>)}
 </div>;
}
