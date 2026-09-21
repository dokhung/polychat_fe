import { createSlice, type PayloadAction, type CaseReducer, type Slice } from "@reduxjs/toolkit";
import type { ErrorCode } from "../common/errors/errorCodes";

export type ApiKey =
    | "auth/login"
    | "auth/signup"
    | "auth/email-availability"
    | "auth/refresh"
    | "auth/logout"
    | "auth/delete"
    | "auth/me";

type ApiRequest = { key: ApiKey; requestId: string };
type ApiCompletion = ApiRequest & { error?: string; errorCode?: ErrorCode };

export type ApiState = {
    status: "idle" | "loading" | "success" | "error";
    requestId?: string;
    error?: string;
    errorCode?: ErrorCode;
};
export const idleApiState: ApiState = { status: "idle" };
export type ApiStatusState = Partial<Record<ApiKey, ApiState>>;
type ApiReducers = {
    started: CaseReducer<ApiStatusState, PayloadAction<ApiRequest>>;
    completed: CaseReducer<ApiStatusState, PayloadAction<ApiCompletion>>;
    reset: CaseReducer<ApiStatusState, PayloadAction<ApiKey>>;
};
const initialState: ApiStatusState = {};

const apiSlice: Slice<ApiStatusState, ApiReducers, "apiStatus"> = createSlice({
    name: "apiStatus",
    initialState,
    reducers: {
        started(state: ApiStatusState, action: PayloadAction<ApiRequest>): void {
            state[action.payload.key] = { status: "loading", requestId: action.payload.requestId };
        },
        completed(state: ApiStatusState, action: PayloadAction<ApiCompletion>): void {
            const { key, requestId, error, errorCode }: ApiCompletion = action.payload;
            if (state[key]?.requestId !== requestId) return;
            state[key] = { status: errorCode || error ? "error" : "success", requestId, error, errorCode };
        },
        reset(state: ApiStatusState, action: PayloadAction<ApiKey>): void {
            delete state[action.payload];
        },
    },
});
export const apiActions: typeof apiSlice.actions = apiSlice.actions;
export default apiSlice.reducer;
