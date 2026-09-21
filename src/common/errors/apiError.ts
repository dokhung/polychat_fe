import { isAxiosError, isCancel } from "axios";
import { ERROR_MESSAGES, isErrorCode } from "./errorCodes.ts";
import type { ErrorCode } from "./errorCodes.ts";

export type ApiError = { code: ErrorCode; message: string; status?: number };

// Current AuthService uses ResponseStatusException rather than a code field.
const BACKEND_MESSAGE_CODES: Readonly<Partial<Record<string, ErrorCode>>> = {
    "이미 가입된 이메일입니다.": "EMAIL_ALREADY_EXISTS",
    "이메일 또는 비밀번호가 올바르지 않습니다.": "INVALID_CREDENTIALS",
    "유효하지 않은 리프레시 토큰입니다.": "INVALID_REFRESH_TOKEN",
    "세션이 만료되었습니다.": "SESSION_EXPIRED",
};

function readResponseCode(data: unknown): ErrorCode | undefined {
    if (typeof data !== "object" || data === null) return undefined;
    if ("code" in data && isErrorCode(data.code)) return data.code;
    if ("errorCode" in data && isErrorCode(data.errorCode)) return data.errorCode;
    const detail: unknown = "detail" in data ? data.detail : undefined;
    const message: unknown = "message" in data ? data.message : undefined;
    return (typeof detail === "string" && Object.hasOwn(BACKEND_MESSAGE_CODES, detail) ? BACKEND_MESSAGE_CODES[detail] : undefined)
        ?? (typeof message === "string" && Object.hasOwn(BACKEND_MESSAGE_CODES, message) ? BACKEND_MESSAGE_CODES[message] : undefined);
}

function resolveErrorCode(error: unknown, fallback: ErrorCode): ErrorCode {
    if (isCancel(error)) return "REQUEST_CANCELLED";
    if (!isAxiosError<unknown, unknown>(error)) return fallback;
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") return "REQUEST_TIMEOUT";
    if (!error.response) return "NETWORK_ERROR";
    const responseCode: ErrorCode | undefined = readResponseCode(error.response.data);
    if (responseCode) return responseCode;
    const status: number = error.response.status;
    if (status >= 500) return "SERVER_ERROR";
    switch (status) {
        case 400: case 422: return "INVALID_REQUEST";
        case 401:
            if (error.config?.url?.split("?")[0]?.endsWith("/auth/refresh")) return "SESSION_EXPIRED";
            if (fallback === "LOGIN_FAILED") return "INVALID_CREDENTIALS";
            return fallback === "REFRESH_FAILED" ? "SESSION_EXPIRED" : "AUTH_REQUIRED";
        case 403: return "FORBIDDEN";
        case 404: return "NOT_FOUND";
        case 409: return fallback === "SIGNUP_FAILED" ? "EMAIL_ALREADY_EXISTS" : "CONFLICT";
        case 429: return "TOO_MANY_REQUESTS";
        default: return fallback;
    }
}

export function getApiError(error: unknown, fallback: ErrorCode = "API_REQUEST_FAILED"): ApiError {
    const code: ErrorCode = resolveErrorCode(error, fallback);
    const status: number | undefined = isAxiosError<unknown, unknown>(error) ? error.response?.status : undefined;
    return { code, message: ERROR_MESSAGES[code], ...(status === undefined ? {} : { status }) };
}

export function getApiErrorMessage(error: unknown, fallback: ErrorCode = "API_REQUEST_FAILED"): string {
    return getApiError(error, fallback).message;
}
