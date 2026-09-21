import { nanoid } from "@reduxjs/toolkit";
import { apiActions, idleApiState } from "./apiSlice";
import type { ApiKey, ApiState } from "./apiSlice";
import { useAppSelector } from "./hooks";
import { store } from "./store";
import type { AppDispatch, RootState } from "./store";
import { getApiError } from "../common/errors/apiError";
import type { ApiError } from "../common/errors/apiError";
import type { ErrorCode } from "../common/errors/errorCodes";

const API_ERROR_CODES: Readonly<Record<ApiKey, ErrorCode>> = {
    "auth/login": "LOGIN_FAILED",
    "auth/signup": "SIGNUP_FAILED",
    "auth/email-availability": "EMAIL_CHECK_FAILED",
    "auth/refresh": "REFRESH_FAILED",
    "auth/logout": "LOGOUT_FAILED",
    "auth/delete": "DELETE_ACCOUNT_FAILED",
    "auth/me": "USER_FETCH_FAILED",
};

// Store call status only; Axios objects and credentials stay outside Redux.
export const runApi: <T>(key: ApiKey, request: () => Promise<T>) => Promise<T> = <T>(key: ApiKey, request: () => Promise<T>): Promise<T> =>
    store.dispatch(async (dispatch: AppDispatch): Promise<T> => {
        const requestId: string = nanoid();
        dispatch(apiActions.started({ key, requestId }));
        try {
            const result: Awaited<T> = await request();
            dispatch(apiActions.completed({ key, requestId }));
            return result;
        } catch (error: unknown) {
            const apiError: ApiError = getApiError(error, API_ERROR_CODES[key]);
            dispatch(apiActions.completed({ key, requestId, error: apiError.message, errorCode: apiError.code }));
            throw error;
        }
    });

export const useApiState: (key: ApiKey) => ApiState = (key: ApiKey): ApiState =>
    useAppSelector((state: RootState): ApiState => state.apiStatus[key] ?? idleApiState);
