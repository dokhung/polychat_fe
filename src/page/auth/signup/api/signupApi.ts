import type { AxiosResponse } from "axios";
import { authClient } from "../../common/client/authClient";
import { runApi } from "../../../../store/apiStore";
import type { SignupRequestDTO } from "../dto/request/SignupRequestDTO";
import type { SignupResponseDTO } from "../dto/response/SignupResponseDTO";

/**
 * 회원가입 요청을 비동기로 전송합니다.
 * @param requestBody 요청 본문 (SignupRequestDTO)
 * @returns 응답 본문 (SignupResponseDTO)을 담은 Promise
 */
export async function requestSignupAsync(requestBody: SignupRequestDTO): Promise<SignupResponseDTO> {
    return runApi("auth/signup", async (): Promise<SignupResponseDTO> => {
        const httpResponse: AxiosResponse<SignupResponseDTO, SignupRequestDTO> = await authClient.post<
            SignupResponseDTO,
            AxiosResponse<SignupResponseDTO, SignupRequestDTO>,
            SignupRequestDTO
        >("/auth/signup", requestBody);
        return httpResponse.data;
    });
}
