export type Vec3 = [number, number, number];
export type SceneMode = 'SPACE' | 'PLANET' | 'HOME' | 'CHARACTER_CREATE' | 'HOME_SELECT' | 'FASHION_SHOP' | 'FURNITURE_SHOP';
export type Panel = 'guest' | 'board' | 'inventory' | 'character' | 'settings' | null;
export type Motion = 'Idle' | 'Walk' | 'Run' | 'Wave' | 'Sit';
export type HomeType = 'cottage' | 'modern' | 'capsule';
export interface CharacterAppearance { face: 'round' | 'soft'; eyes: string; skin: string; hair: string; hairColor: string; top: string; bottom: string; shoes: string; accessory: string }
export interface CharacterProfile { gender: 'Male' | 'Female'; nickname: string; level: number; appearance: CharacterAppearance }
export interface HomeProfile { homeType: HomeType; position: Vec3; rotation: number }
export interface OwnedFashionItem { id: string }
export interface OwnedFurniture { furnitureId: string }
export interface PlacedFurniture { id: string; furnitureId: string; position: Vec3; rotation: number; scale: number }
export interface GuestBookEntry { id: string; avatar: string; nickname: string; message: string; createdAt: string }
export interface BoardPost { id: string; authorNickname: string; title: string; content: string; createdAt: string; likes: number; liked: boolean; comments: { id: string; nickname: string; content: string }[] }
export interface Inventory { fashion: OwnedFashionItem[]; furniture: OwnedFurniture[] }
export interface Currency { coins: number }
export interface SpaceProfile { version: 1; character: CharacterProfile | null; selectedHome: HomeProfile | null; inventory: Inventory; currency: Currency; placedFurniture: PlacedFurniture[]; guests: GuestBookEntry[]; posts: BoardPost[] }
export interface FurnitureItem { id: string; name: string; category: string; price: number; color: string; modelUrl: string | null; thumbnail: string }
export interface FashionItem { id: string; name: string; slot: keyof CharacterAppearance; value: string; price: number }
export interface Interaction { interactionId: string; position: Vec3; radius: number; label: string; action: 'home' | 'exit' | 'fashion' | 'furniture' | 'guest' | 'board' | 'mail' }
