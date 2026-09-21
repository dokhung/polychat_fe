import type { AxiosResponse } from "axios";
import { authClient } from "../../auth/common/client/authClient";
import { runApi } from "../../../store/apiStore";
import type { LogoutRequestDTO } from "../dto/request/LogoutRequestDTO";
import type { UserResponseDTO } from "../dto/response/UserResponseDTO";

/**
 * 로그아웃 요청을 비동기로 전송합니다.
 * @param requestBody 요청 본문 (LogoutRequestDTO)
 * @returns 응답 본문 없이 완료되는 Promise<void>
 */
export async function requestLogoutAsync(requestBody: LogoutRequestDTO): Promise<void> {
    return runApi("auth/logout", async (): Promise<void> => {
        await authClient.post<
            void,
            AxiosResponse<void, LogoutRequestDTO>,
            LogoutRequestDTO
        >("/auth/logout", requestBody);
    });
}

/**
 * 회원탈퇴 요청을 비동기로 전송합니다. 요청 본문은 없습니다.
 * @returns HTTP 204 응답 본문 없이 완료되는 Promise<void>
 */
export async function requestDeleteAccountAsync(): Promise<void> {
    return runApi("auth/delete", async (): Promise<void> => {
        await authClient.delete<void>("/auth/me");
    });
}

/**
 * 현재 사용자 조회 요청을 비동기로 전송합니다. 요청 본문은 없습니다.
 * @returns 응답 본문 (UserResponseDTO)을 담은 Promise
 */
export async function requestCurrentUserAsync(): Promise<UserResponseDTO> {
    return runApi("auth/me", async (): Promise<UserResponseDTO> => {
        const httpResponse: AxiosResponse<UserResponseDTO, unknown> = await authClient.get<UserResponseDTO>("/auth/me");
        return httpResponse.data;
    });
}
