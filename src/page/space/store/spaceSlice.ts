import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { spaceRepository } from '../data/spaceRepository.ts';
import { fashion, furniture } from '../data/mockSpaceData.ts';
import type { CharacterProfile, HomeType, SceneMode, Panel, Motion, PlacedFurniture, BoardPost, GuestBookEntry } from '../types/space.types';
const spaceSlice = createSlice({ name: 'space', initialState: {
  profile: spaceRepository.load(), mode: 'SPACE' as SceneMode, panel: null as Panel, motion: 'Idle' as Motion, editing: false, notice: '', reducedMotion: false,
}, reducers: {
  setMode(s, a: PayloadAction<SceneMode>) { s.mode = a.payload; s.panel = null; s.editing = false; s.motion = 'Idle'; },
  setPanel(s, a: PayloadAction<Panel>) { s.panel = a.payload; },
  setMotion(s, a: PayloadAction<Motion>) { s.motion = a.payload; },
  setEditing(s, a: PayloadAction<boolean>) { s.editing = a.payload; },
  setNotice(s, a: PayloadAction<string>) { s.notice = a.payload; },
  setReducedMotion(s, a: PayloadAction<boolean>) { s.reducedMotion = a.payload; },
  createCharacter(s, a: PayloadAction<CharacterProfile>) {
    s.profile.character = a.payload;
    for (const item of fashion) if (a.payload.appearance[item.slot] === item.value && !s.profile.inventory.fashion.some(i => i.id === item.id)) s.profile.inventory.fashion.push({ id: item.id });
    s.mode = 'HOME_SELECT';
  },
  chooseHome(s, a: PayloadAction<HomeType>) { s.profile.selectedHome = { homeType: a.payload, position: [0, 0, -2.4], rotation: 0 }; s.mode = 'PLANET'; },
  buyFashion(s, a: PayloadAction<string>) {
    const item = fashion.find(i => i.id === a.payload); if (!item || !s.profile.character) return;
    if (!s.profile.inventory.fashion.some(i => i.id === item.id)) { if (s.profile.currency.coins < item.price) { s.notice = 'Star Coin이 부족해요.'; return; } s.profile.currency.coins -= item.price; s.profile.inventory.fashion.push({ id: item.id }); }
    Object.assign(s.profile.character.appearance, { [item.slot]: item.value }); s.notice = `${item.name} 착용 완료`;
  },
  buyFurniture(s, a: PayloadAction<string>) {
    const item = furniture.find(i => i.id === a.payload); if (!item || s.profile.inventory.furniture.some(i => i.furnitureId === item.id)) return;
    if (s.profile.currency.coins < item.price) { s.notice = 'Star Coin이 부족해요.'; return; }
    s.profile.currency.coins -= item.price; s.profile.inventory.furniture.push({ furnitureId: item.id }); s.notice = `${item.name} 구입 완료. 집의 Edit Room에서 배치하세요.`;
  },
  saveFurniture(s, a: PayloadAction<PlacedFurniture[]>) { s.profile.placedFurniture = a.payload; s.editing = false; s.notice = '방을 저장했어요.'; },
  addGuest(s, a: PayloadAction<GuestBookEntry>) { s.profile.guests.unshift(a.payload); },
  addPost(s, a: PayloadAction<BoardPost>) { s.profile.posts.unshift(a.payload); },
  likePost(s, a: PayloadAction<string>) { const p = s.profile.posts.find(p => p.id === a.payload); if (p) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; } },
  addComment(s, a: PayloadAction<{ postId: string; id: string; content: string }>) { const p = s.profile.posts.find(p => p.id === a.payload.postId); if (p) p.comments.push({ id: a.payload.id, content: a.payload.content, nickname: s.profile.character?.nickname ?? 'Traveler' }); },
} });
export const spaceActions = spaceSlice.actions;
export default spaceSlice.reducer;
