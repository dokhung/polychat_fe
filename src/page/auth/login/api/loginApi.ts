import type { AxiosResponse } from "axios";
import { authClient } from "../../common/client/authClient";
import { runApi } from "../../../../store/apiStore";
import type { LoginRequestDTO } from "../dto/request/LoginRequestDTO";
import type { LoginResponseDTO } from "../dto/response/LoginResponseDTO";

/**
 * 로그인 요청을 비동기로 전송합니다.
 * @param requestBody 요청 본문 (LoginRequestDTO)
 * @returns 응답 본문 (LoginResponseDTO)을 담은 Promise
 */
export async function requestLoginAsync(requestBody: LoginRequestDTO): Promise<LoginResponseDTO> {
    return runApi("auth/login", async (): Promise<LoginResponseDTO> => {
        const httpResponse: AxiosResponse<LoginResponseDTO, LoginRequestDTO> = await authClient.post<
            LoginResponseDTO,
            AxiosResponse<LoginResponseDTO, LoginRequestDTO>,
            LoginRequestDTO
        >("/auth/login", requestBody);
        return httpResponse.data;
    });
}
