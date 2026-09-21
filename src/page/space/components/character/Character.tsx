import React, { Suspense } from 'react';
import type { CharacterAppearance, Motion, Vec3 } from '../../types/space.types';
import { defaultAppearance } from '../../data/mockSpaceData';
import { AvatarModel } from './AvatarModel';
export function Orb({ at, size, color, scale }: { at: Vec3; size: number; color: string; scale?: Vec3 }) {
  return <mesh position={at} scale={scale} castShadow><sphereGeometry args={[size, 20, 14]} /><meshStandardMaterial color={color} roughness={.78} /></mesh>;
}
export function Character({ gender = 'Male', appearance = defaultAppearance, motion = 'Idle', animate = true }: {
  gender?: 'Male' | 'Female'; appearance?: CharacterAppearance; motion?: Motion; animate?: boolean;
}) {
  return <Suspense fallback={null}><AvatarModel key={gender + '-' + appearance.hair} gender={gender} appearance={appearance} motion={motion} animate={animate} /></Suspense>;
}
