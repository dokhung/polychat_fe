import { initialProfile } from './mockSpaceData.ts';
import type { SpaceProfile } from '../types/space.types';
export interface SpaceRepository { load(): SpaceProfile; save(profile: SpaceProfile): boolean; checkNickname(name: string): Promise<string | null> }
export function validateNickname(name: string): string | null {
  if (!/^[\p{L}\p{N}_]{2,16}$/u.test(name)) return '2~16자의 한글, 영문, 숫자, 밑줄만 사용할 수 있어요.';
  if (['admin', 'administrator', '운영자'].includes(name.toLowerCase())) return '사용할 수 없는 닉네임이에요.';
  return null;
}
export const spaceRepository: SpaceRepository = {
  load() {
    try {
      const raw = localStorage.getItem('space-profile');
      if (!raw) return initialProfile();
      const p = JSON.parse(raw) as SpaceProfile;
      if (p.version !== 1 || !Number.isFinite(p.currency?.coins) || p.currency.coins < 0 || !Array.isArray(p.inventory?.fashion) || !Array.isArray(p.inventory?.furniture) || !Array.isArray(p.placedFurniture) || !Array.isArray(p.guests) || !Array.isArray(p.posts)) return initialProfile();
      if (p.character && (!p.character.appearance || typeof p.character.nickname !== 'string')) return initialProfile();
      if (p.selectedHome && !['cottage', 'modern', 'capsule'].includes(p.selectedHome.homeType)) return initialProfile();
      const vector = (v: unknown) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
      if (p.selectedHome && (!vector(p.selectedHome.position) || !Number.isFinite(p.selectedHome.rotation))) return initialProfile();
      if (p.placedFurniture.some(i => !i || typeof i.id !== 'string' || typeof i.furnitureId !== 'string' || !vector(i.position) || !Number.isFinite(i.rotation) || !Number.isFinite(i.scale))) return initialProfile();
      if (p.guests.some(i => !i || typeof i.message !== 'string' || typeof i.nickname !== 'string') || p.posts.some(i => !i || typeof i.title !== 'string' || typeof i.content !== 'string' || !Array.isArray(i.comments))) return initialProfile();
      return p;
    } catch { return initialProfile(); }
  },
  save(profile) { try { localStorage.setItem('space-profile', JSON.stringify(profile)); return true; } catch { return false; } },
  async checkNickname(name) {
    const error = validateNickname(name);
    if (error) return error;
    return ['luna', 'nova', 'moontraveler'].includes(name.toLowerCase()) ? '이미 사용 중인 닉네임이에요. 다른 이름을 골라 주세요.' : null;
  },
};
