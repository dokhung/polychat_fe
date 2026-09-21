import assert from 'node:assert/strict';
import { test } from 'node:test';
import reducer, { spaceActions } from '../src/page/space/store/spaceSlice.ts';
import { initialProfile, defaultAppearance, planetInteractions } from '../src/page/space/data/mockSpaceData.ts';
import { spaceRepository, validateNickname } from '../src/page/space/data/spaceRepository.ts';
import { constrainPosition, nearestInteraction, collidesOutside } from '../src/page/space/hooks/worldMovement.ts';

test('nickname validation rejects whitespace, markup, reserved and duplicate names', async () => {
 for (const name of ['', ' ', 'a', '<script>', 'name with space', 'admin', 'a'.repeat(17)]) assert.ok(validateNickname(name));
 assert.equal(validateNickname('별여행자_12'), null);
 assert.ok(await spaceRepository.checkNickname('LUNA'));
 assert.equal(await spaceRepository.checkNickname('별여행자_12'), null);
});
test('purchases are atomic, owned items are not charged twice, insufficient funds cannot equip', () => {
 let state = reducer(undefined, { type: 'init' });
 state = { ...state, profile: initialProfile() };
 state = reducer(state, spaceActions.createCharacter({ gender: 'Female', nickname: 'TestStar', level: 1, appearance: defaultAppearance }));
 assert.ok(state.profile.inventory.fashion.some(i => i.id === 'basic-bottom'));
 assert.ok(state.profile.inventory.fashion.some(i => i.id === 'basic-shoes'));
 state = reducer(state, spaceActions.buyFashion('hair-4'));
 assert.equal(state.profile.currency.coins, 1150);
 assert.equal(state.profile.character?.appearance.hair, 'Ponytail');
 state = reducer(state, spaceActions.buyFashion('hair-4'));
 assert.equal(state.profile.currency.coins, 1150);
 state = reducer(state, spaceActions.buyFurniture('table'));
 state = reducer(state, spaceActions.buyFurniture('table'));
 assert.equal(state.profile.currency.coins, 1030);
 assert.equal(state.profile.inventory.furniture.filter(i => i.furnitureId === 'table').length, 1);
 state = { ...state, profile: { ...state.profile, currency: { coins: 0 } } };
 state = reducer(state, spaceActions.buyFashion('halo'));
 assert.equal(state.profile.character?.appearance.accessory, 'none');
 assert.equal(state.profile.currency.coins, 0);
});
test('circular surface keeps players on the planet and chooses only nearest eligible zone', () => {
 const [x,z] = constrainPosition(100,100,false);
 assert.ok(Math.abs(Math.hypot(x,z)-5.08)<.0001);
 assert.deepEqual(constrainPosition(100,-100,true),[3.55,-3.1]);
 assert.equal(nearestInteraction(0,4,planetInteractions),null);
 assert.equal(nearestInteraction(0,-1,planetInteractions)?.action,'home');
 assert.equal(collidesOutside(0,-2.4),true);
 assert.equal(collidesOutside(0,1),false);
});
test('repository persists a complete profile and safely recovers from corrupt or unavailable storage', () => {
 const descriptor = Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 let raw: string | null = null;
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value;}}});
 try {
   const profile=initialProfile(); profile.currency.coins=500;
   assert.equal(spaceRepository.save(profile),true);
   assert.deepEqual(spaceRepository.load(),profile);
   raw='{bad'; assert.equal(spaceRepository.load().currency.coins,1250);
   raw='{}'; assert.equal(spaceRepository.load().character,null);
   Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('blocked');}});
   assert.equal(spaceRepository.save(profile),false);
   assert.equal(spaceRepository.load().currency.coins,1250);
 } finally { if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else Reflect.deleteProperty(globalThis,'localStorage'); }
});
