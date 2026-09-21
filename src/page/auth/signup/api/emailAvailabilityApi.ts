import type { AxiosResponse } from "axios";
import { authClient } from "../../common/client/authClient";
import { runApi } from "../../../../store/apiStore";
import type { EmailAvailabilityRequestDTO } from "../dto/request/EmailAvailabilityRequestDTO";
import type { EmailAvailabilityResponseDTO } from "../dto/response/EmailAvailabilityResponseDTO";

/**
 * 이메일 사용 가능 여부 조회 요청을 비동기로 전송합니다.
 * @param requestParams 쿼리 파라미터 (EmailAvailabilityRequestDTO)
 * @returns 응답 본문 (EmailAvailabilityResponseDTO)을 담은 Promise
 */
export async function requestEmailAvailabilityAsync(requestParams: EmailAvailabilityRequestDTO): Promise<EmailAvailabilityResponseDTO> {
    return runApi("auth/email-availability", async (): Promise<EmailAvailabilityResponseDTO> => {
        const httpResponse: AxiosResponse<EmailAvailabilityResponseDTO, unknown> = await authClient.get<EmailAvailabilityResponseDTO>("/auth/email-availability", { params: requestParams });
        return httpResponse.data;
    });
}
