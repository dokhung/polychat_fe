import type { AxiosResponse } from "axios";
import { httpClient } from "../client/httpClient";
import { runApi } from "../../../../store/apiStore";
import type { RefreshTokenRequestDTO } from "../dto/request/RefreshTokenRequestDTO";
import type { TokenResponseDTO } from "../dto/response/TokenResponseDTO";

/**
 * 토큰 갱신 요청을 비동기로 전송합니다.
 * @param requestBody 요청 본문 (RefreshTokenRequestDTO)
 * @returns 응답 본문 (TokenResponseDTO)을 담은 Promise
 */
export async function requestTokenRefreshAsync(requestBody: RefreshTokenRequestDTO): Promise<TokenResponseDTO> {
    return runApi("auth/refresh", async (): Promise<TokenResponseDTO> => {
        const httpResponse: AxiosResponse<TokenResponseDTO, RefreshTokenRequestDTO> = await httpClient.post<
            TokenResponseDTO,
            AxiosResponse<TokenResponseDTO, RefreshTokenRequestDTO>,
            RefreshTokenRequestDTO
        >("/auth/refresh", requestBody);
        return httpResponse.data;
    });
}
