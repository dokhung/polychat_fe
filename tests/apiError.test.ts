import assert from "node:assert/strict";
import { test } from "node:test";
import { AxiosError, AxiosHeaders, CanceledError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getApiError, getApiErrorMessage } from "../src/common/errors/apiError.ts";
import { ERROR_MESSAGES } from "../src/common/errors/errorCodes.ts";
import type { ErrorCode } from "../src/common/errors/errorCodes.ts";
import apiReducer, { apiActions } from "../src/store/apiSlice.ts";
import type { ApiStatusState } from "../src/store/apiSlice.ts";

function httpError(status: number, data: unknown, url: string = "/auth/login"): AxiosError<unknown, unknown> {
    const config: InternalAxiosRequestConfig<unknown> = { headers: new AxiosHeaders(), url };
    const response: AxiosResponse<unknown, unknown> = { data, status, statusText: "Error", headers: new AxiosHeaders(), config };
    return new AxiosError<unknown, unknown>("Request failed", undefined, config, undefined, response);
}

test("known response codes take precedence and unknown codes use the HTTP fallback", (): void => {
    assert.equal(getApiError(httpError(401, { code: "SESSION_EXPIRED" }), "LOGIN_FAILED").code, "SESSION_EXPIRED");
    assert.equal(getApiError(httpError(400, { errorCode: "EMAIL_ALREADY_EXISTS" })).code, "EMAIL_ALREADY_EXISTS");
    assert.equal(getApiError(httpError(409, { code: "UNKNOWN_BACKEND_CODE" }), "SIGNUP_FAILED").code, "EMAIL_ALREADY_EXISTS");
});

test("current backend detail and message formats map to frontend codes", (): void => {
    assert.equal(getApiError(httpError(401, { detail: "세션이 만료되었습니다." })).code, "SESSION_EXPIRED");
    assert.equal(getApiError(httpError(401, { message: "유효하지 않은 리프레시 토큰입니다." })).code, "INVALID_REFRESH_TOKEN");
    assert.equal(getApiError(httpError(409, { message: "이미 가입된 이메일입니다." })).code, "EMAIL_ALREADY_EXISTS");
});

test("empty login, signup and refresh responses retain operation-specific meaning", (): void => {
    assert.equal(getApiError(httpError(401, null), "LOGIN_FAILED").code, "INVALID_CREDENTIALS");
    assert.equal(getApiError(httpError(409, null), "SIGNUP_FAILED").code, "EMAIL_ALREADY_EXISTS");
    assert.equal(getApiError(httpError(401, null), "REFRESH_FAILED").code, "SESSION_EXPIRED");
    assert.equal(getApiError(httpError(401, null, "/auth/refresh"), "LOGIN_FAILED").code, "SESSION_EXPIRED");
});

test("HTTP status errors are consistently classified", (): void => {
    const cases: Array<[number, ErrorCode]> = [[400, "INVALID_REQUEST"], [401, "AUTH_REQUIRED"], [403, "FORBIDDEN"], [404, "NOT_FOUND"], [409, "CONFLICT"], [422, "INVALID_REQUEST"], [429, "TOO_MANY_REQUESTS"], [500, "SERVER_ERROR"], [503, "SERVER_ERROR"]];
    cases.forEach(([status, code]: [number, ErrorCode]): void => {
        assert.deepEqual(getApiError(httpError(status, {})), { code, message: ERROR_MESSAGES[code], status });
    });
});

test("malformed data and inherited property names cannot become error codes or messages", (): void => {
    const payloads: unknown[] = [null, "html", 42, [], { detail: {} }, { code: "toString" }, { detail: "__proto__" }, { message: "internal database credentials" }];
    payloads.forEach((data: unknown): void => {
        assert.equal(getApiErrorMessage(httpError(500, data)), ERROR_MESSAGES.SERVER_ERROR);
    });
});

test("network, timeout, cancellation and non-Axios failures have distinct fallbacks", (): void => {
    assert.equal(getApiError(new AxiosError("offline", "ERR_NETWORK")).code, "NETWORK_ERROR");
    assert.equal(getApiError(new AxiosError("timeout", "ECONNABORTED")).code, "REQUEST_TIMEOUT");
    assert.equal(getApiError(new AxiosError("timeout", "ETIMEDOUT")).code, "REQUEST_TIMEOUT");
    assert.equal(getApiError(new CanceledError()).code, "REQUEST_CANCELLED");
    assert.equal(getApiError(new Error("failure"), "DELETE_ACCOUNT_FAILED").code, "DELETE_ACCOUNT_FAILED");
    assert.equal(getApiError(undefined).code, "API_REQUEST_FAILED");
});

test("Redux retains the error code and ignores stale failures", (): void => {
    const loading: ApiStatusState = apiReducer(undefined, apiActions.started({ key: "auth/login", requestId: "new" }));
    const stale: ApiStatusState = apiReducer(loading, apiActions.completed({ key: "auth/login", requestId: "old", error: ERROR_MESSAGES.NETWORK_ERROR, errorCode: "NETWORK_ERROR" }));
    assert.equal(stale["auth/login"]?.status, "loading");
    const failed: ApiStatusState = apiReducer(stale, apiActions.completed({ key: "auth/login", requestId: "new", error: ERROR_MESSAGES.INVALID_CREDENTIALS, errorCode: "INVALID_CREDENTIALS" }));
    assert.equal(failed["auth/login"]?.errorCode, "INVALID_CREDENTIALS");
    assert.equal(failed["auth/login"]?.status, "error");
    const restarted: ApiStatusState = apiReducer(failed, apiActions.started({ key: "auth/login", requestId: "retry" }));
    assert.equal(restarted["auth/login"]?.errorCode, undefined);
});
