import { useEffect, useRef } from 'react';
export interface MovementInput { x: number; z: number; run: boolean }
export function isTyping(target: EventTarget | null) { return target instanceof HTMLElement && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable); }
// A virtual joystick can supply this same input without changing world movement.
export function useCharacterController(enabled: boolean) {
 const keys = useRef(new Set<string>());
 const taps = useRef(new Map<string, number>());
 useEffect(() => {
   keys.current.clear(); taps.current.clear();
   if (!enabled) return;
   const down = (e: KeyboardEvent) => { if (isTyping(e.target)) return; if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault(); keys.current.add(e.key.toLowerCase()); if (!e.repeat) taps.current.set(e.key.toLowerCase(),performance.now()+100); };
   const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
   const clear = () => { keys.current.clear(); taps.current.clear(); };
   window.addEventListener('keydown',down); window.addEventListener('keyup',up); window.addEventListener('blur',clear);
   return () => { window.removeEventListener('keydown',down); window.removeEventListener('keyup',up); window.removeEventListener('blur',clear); clear(); };
 }, [enabled]);
 const pressed=(key:string)=>keys.current.has(key)||(taps.current.get(key)??0)>performance.now();
 return () : MovementInput => ({ x: Number(pressed('d') || pressed('arrowright')) - Number(pressed('a') || pressed('arrowleft')), z: Number(pressed('s') || pressed('arrowdown')) - Number(pressed('w') || pressed('arrowup')), run: pressed('shift') });
}
