import type { AxiosInstance } from "axios";
import { isAxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { requestTokenRefreshAsync } from "../api/refreshTokenApi";
import type { TokenResponseDTO } from "../dto/response/TokenResponseDTO";
import type { RefreshTokenRequestDTO } from "../dto/request/RefreshTokenRequestDTO";
import { clearAuthQueries } from "../../../../query/queryClient";

export const authClient: AxiosInstance = httpClient;

type RetryRequestConfig = InternalAxiosRequestConfig<unknown> & { _retry?: boolean };

export const getRefreshToken: () => string | null = (): string | null => localStorage.getItem("polychat.refreshToken");

export const saveTokens: (tokens: TokenResponseDTO) => void = (tokens: TokenResponseDTO): void => {
    localStorage.setItem("polychat.accessToken", tokens.accessToken);
    localStorage.setItem("polychat.refreshToken", tokens.refreshToken);
};

export const clearTokens: () => void = (): void => {
    clearAuthQueries();
    localStorage.removeItem("polychat.accessToken");
    localStorage.removeItem("polychat.refreshToken");
};

authClient.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>): InternalAxiosRequestConfig<unknown> => {
    const token: string | null = localStorage.getItem("polychat.accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshing: Promise<string> | null = null;

authClient.interceptors.response.use((response: AxiosResponse<unknown, unknown>): AxiosResponse<unknown, unknown> => response, async (error: unknown): Promise<AxiosResponse<unknown, unknown>> => {
    if (!isAxiosError<unknown, unknown>(error)) return Promise.reject(error);
    const original: RetryRequestConfig | undefined = error.config;
    const isRefreshRequest: boolean | undefined = original?.url?.includes("/auth/refresh");
    if (!original || error.response?.status !== 401 || isRefreshRequest || original._retry) {
        return Promise.reject(error);
    }

    const refreshToken: string | null = getRefreshToken();
    if (!refreshToken) return Promise.reject(error);
    original._retry = true;
    const request: RefreshTokenRequestDTO = { refreshToken };

    refreshing ??= requestTokenRefreshAsync(request)
        .then((response: TokenResponseDTO): string => {
            saveTokens(response);
            return response.accessToken;
        })
        .finally((): void => { refreshing = null; });

    try {
        original.headers.Authorization = `Bearer ${await refreshing}`;
        return authClient(original);
    } catch (refreshError: unknown) {
        clearTokens();
        window.dispatchEvent(new Event("polychat:logout"));
        return Promise.reject(refreshError);
    }
});
