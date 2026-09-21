import type { Interaction } from '../types/space.types';
export function constrainPosition(x: number, z: number, inside: boolean): [number, number] {
 if (inside) return [Math.max(-3.55, Math.min(3.55,x)), Math.max(-3.1,Math.min(3.45,z))];
 const length = Math.hypot(x,z); return length > 5.08 ? [x / length * 5.08,z / length * 5.08] : [x,z];
}
export function nearestInteraction(x: number, z: number, zones: Interaction[]) {
 let nearest: Interaction | null = null, distance = Infinity;
 for (const zone of zones) { const d = Math.hypot(x - zone.position[0],z - zone.position[2]); if (d < zone.radius && d < distance) { nearest = zone; distance = d; } }
 return nearest;
}
export function collidesOutside(x: number, z: number) { return [{ x:0,z:-2.4,w:1.12,d:.92 },{ x:-3.35,z:-.85,w:.87,d:.74 },{ x:3.35,z:-.85,w:.87,d:.74 }].some(b => Math.abs(x-b.x)<b.w && Math.abs(z-b.z)<b.d); }
