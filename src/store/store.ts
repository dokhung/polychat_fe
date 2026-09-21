import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./apiSlice";
import type { ApiStatusState } from "./apiSlice";
import spaceReducer from '../page/space/store/spaceSlice';
import { spaceRepository } from '../page/space/data/spaceRepository';

export type RootState = { apiStatus: ApiStatusState; space: ReturnType<typeof spaceReducer> };
export type AppStore = ReturnType<typeof configureStore<RootState>>;

export const store: AppStore = configureStore<RootState>({
    reducer: { apiStatus: apiReducer, space: spaceReducer },
    devTools: import.meta.env.DEV,
});
export type AppDispatch = AppStore["dispatch"];
let lastSpaceProfile = store.getState().space.profile;
store.subscribe(() => {
    const profile = store.getState().space.profile;
    if (profile === lastSpaceProfile) return;
    lastSpaceProfile = profile;
    if (!spaceRepository.save(profile)) store.dispatch({ type: 'space/setNotice', payload: '저장 공간에 접근할 수 없어요. 이번 변경은 새로고침하면 사라질 수 있어요.' });
});
