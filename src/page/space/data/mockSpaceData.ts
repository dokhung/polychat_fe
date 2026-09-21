import type { CharacterAppearance, FashionItem, FurnitureItem, SpaceProfile, Interaction } from '../types/space.types';
export const defaultAppearance: CharacterAppearance = { face: 'round', eyes: '#39314f', skin: '#efc4a6', hair: 'Short', hairColor: '#795144', top: '#b5a4ed', bottom: '#484867', shoes: '#fff2de', accessory: 'none' };
export const hairColors = ['#302c38', '#795144', '#efd49a', '#eae7f6', '#e69abe', '#83afdf'];
export const hairStyles = ['Short', 'Medium', 'Long', 'Bob', 'Ponytail'];
export const furniture: FurnitureItem[] = [
  { id: 'sofa', name: 'Cloud sofa', category: 'Sofa', price: 240, color: '#b1a2d9', modelUrl: null, thumbnail: '▰' },
  { id: 'bed', name: 'Moonlight bed', category: 'Bed', price: 300, color: '#9bbac8', modelUrl: null, thumbnail: '▱' },
  { id: 'chair', name: 'Little lounge', category: 'Chair', price: 90, color: '#e6bd83', modelUrl: null, thumbnail: '♧' },
  { id: 'table', name: 'Pebble table', category: 'Table', price: 120, color: '#d6ac81', modelUrl: null, thumbnail: '▰' },
  { id: 'lamp', name: 'Stardust lamp', category: 'Lamp', price: 80, color: '#ffde9f', modelUrl: null, thumbnail: '☼' },
  { id: 'plant', name: 'Happy little fern', category: 'Plant', price: 60, color: '#85b59b', modelUrl: null, thumbnail: '♧' },
  { id: 'rug', name: 'Lunar rug', category: 'Rug', price: 100, color: '#b8a1bf', modelUrl: null, thumbnail: '◉' },
  { id: 'shelf', name: 'Story keeper', category: 'Shelf', price: 170, color: '#c49e85', modelUrl: null, thumbnail: '▤' },
  { id: 'decoration', name: 'Pocket planet', category: 'Decoration', price: 75, color: '#ddb5d9', modelUrl: null, thumbnail: '♄' },
];
export const fashion: FashionItem[] = [
  { id: 'basic-bottom', name: 'Midnight trousers', slot: 'bottom', value: '#484867', price: 0 },
  { id: 'basic-shoes', name: 'Cloud sneakers', slot: 'shoes', value: '#fff2de', price: 0 },
  { id: 'accessory-none', name: 'No accessory', slot: 'accessory', value: 'none', price: 0 },
  ...hairStyles.map((value, i) => ({ id: `hair-${i}`, name: value, slot: 'hair' as const, value, price: i ? 100 : 0 })),
  ...hairColors.map((value, i) => ({ id: `color-${i}`, name: ['Black', 'Brown', 'Blonde', 'White', 'Pink', 'Blue'][i]!, slot: 'hairColor' as const, value, price: 40 })),
  ...(['top', 'bottom', 'shoes'] as const).flatMap(slot => ['#b5a4ed', '#9dcabd', '#efad9c'].map((value, i) => ({ id: `${slot}-${i}`, name: `${['Lavender', 'Sage', 'Peach'][i]} ${slot}`, slot, value, price: 85 }))),
  { id: 'halo', name: 'Orbit halo', slot: 'accessory', value: 'halo', price: 150 },
];
export function initialProfile(): SpaceProfile { return { version: 1, character: null, selectedHome: null, currency: { coins: 1250 }, inventory: { fashion: [{ id: 'hair-0' }], furniture: [{ furnitureId: 'bed' }, { furnitureId: 'sofa' }, { furnitureId: 'plant' }] }, placedFurniture: [
  { id: 'starter-bed', furnitureId: 'bed', position: [2.5, 0, -2], rotation: 0, scale: 1 },
  { id: 'starter-sofa', furnitureId: 'sofa', position: [-2, 0, -1], rotation: 0, scale: 1 },
  { id: 'starter-plant', furnitureId: 'plant', position: [-3, 0, -2.7], rotation: 0, scale: 1 },
], guests: [
  { id: 'luna', nickname: 'Luna', avatar: '☾', message: '집이 정말 예뻐요! 달빛이 잘 어울리는 작은 별이네요.', createdAt: '2026-09-21T10:00:00Z' },
  { id: 'nova', nickname: 'Nova', avatar: '✧', message: '놀러 왔다 갑니다 :) 다음에는 같이 별을 봐요.', createdAt: '2026-09-20T09:00:00Z' },
], posts: [] }; }
export const planetInteractions: Interaction[] = [
  { interactionId: 'home', position: [0, 0, -1.25], radius: 1.3, label: 'Enter Home', action: 'home' },
  { interactionId: 'fashion', position: [-3.1, 0, .1], radius: 1.25, label: 'Enter Fashion Shop', action: 'fashion' },
  { interactionId: 'furniture', position: [3.1, 0, .1], radius: 1.25, label: 'Enter Furniture Shop', action: 'furniture' },
  { interactionId: 'guest', position: [2.8, 0, 2.5], radius: 1.1, label: 'Guest Book', action: 'guest' },
  { interactionId: 'mail', position: [-1.4, 0, -1.1], radius: .65, label: 'Open Mailbox', action: 'mail' },
];
export const homeInteractions: Interaction[] = [
  { interactionId: 'exit', position: [0, 0, 3.2], radius: 1, label: 'Leave Home', action: 'exit' },
  { interactionId: 'board', position: [0, 0, -2.6], radius: 1.3, label: 'Personal Board', action: 'board' },
  { interactionId: 'guest', position: [-3, 0, 1], radius: 1, label: 'Guest Book', action: 'guest' },
];
