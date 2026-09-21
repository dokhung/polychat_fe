import React, { useEffect, useRef } from 'react';
export function Panel({ title, eyebrow, onClose, children, wide = false }: { title: string; eyebrow: string; onClose?: () => void; children: React.ReactNode; wide?: boolean }) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close();},[]);
 return <dialog ref={ref} className={`space-panel ${wide?'wide':''}`} aria-label={title} onCancel={e=>{e.preventDefault();onClose?.();}}><header><div><p className="space-kicker">{eyebrow}</p><h2>{title}</h2></div>{onClose&&<button className="icon-button" onClick={onClose} aria-label="Close panel">✕</button>}</header>{children}</dialog>;
}
