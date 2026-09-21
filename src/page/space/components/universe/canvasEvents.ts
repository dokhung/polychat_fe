import { events } from '@react-three/fiber';
// Canvas creation may finish after its dialog is removed (rapid navigation/HMR).
// Ignore a detached event target instead of connecting listeners to null.
export const canvasEvents: typeof events = (state) => {
  const manager = events(state);
  const connect = manager.connect;
  return { ...manager, connect: (target) => { if (target) connect?.(target); } };
};
