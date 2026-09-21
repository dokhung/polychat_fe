import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { authQueryKeys } from "./queryClient";
import { requestLoginAsync } from "../page/auth/login/api/loginApi";
import { requestSignupAsync } from "../page/auth/signup/api/signupApi";
import { requestEmailAvailabilityAsync } from "../page/auth/signup/api/emailAvailabilityApi";
import { requestCurrentUserAsync, requestDeleteAccountAsync, requestLogoutAsync } from "../page/home/api/accountApi";
import type { LoginRequestDTO } from "../page/auth/login/dto/request/LoginRequestDTO";
import type { LoginResponseDTO } from "../page/auth/login/dto/response/LoginResponseDTO";
import type { SignupRequestDTO } from "../page/auth/signup/dto/request/SignupRequestDTO";
import type { SignupResponseDTO } from "../page/auth/signup/dto/response/SignupResponseDTO";
import type { EmailAvailabilityResponseDTO } from "../page/auth/signup/dto/response/EmailAvailabilityResponseDTO";
import type { LogoutRequestDTO } from "../page/home/dto/request/LogoutRequestDTO";
import type { UserResponseDTO } from "../page/home/dto/response/UserResponseDTO";

export function useCurrentUserQuery(enabled: boolean): UseQueryResult<UserResponseDTO, unknown> {
    return useQuery<UserResponseDTO, unknown>({
        queryKey: authQueryKeys.currentUser,
        queryFn: requestCurrentUserAsync,
        enabled,
    });
}

export function useEmailAvailabilityQuery(email: string): UseQueryResult<EmailAvailabilityResponseDTO, unknown> {
    return useQuery<EmailAvailabilityResponseDTO, unknown>({
        queryKey: authQueryKeys.email(email),
        queryFn: (): Promise<EmailAvailabilityResponseDTO> => requestEmailAvailabilityAsync({ email }),
        enabled: false,
        staleTime: 0,
        gcTime: 0,
    });
}

export function useLoginMutation(): UseMutationResult<LoginResponseDTO, unknown, LoginRequestDTO> {
    return useMutation<LoginResponseDTO, unknown, LoginRequestDTO>({ mutationFn: requestLoginAsync });
}

export function useSignupMutation(): UseMutationResult<SignupResponseDTO, unknown, SignupRequestDTO> {
    return useMutation<SignupResponseDTO, unknown, SignupRequestDTO>({ mutationFn: requestSignupAsync });
}

export function useLogoutMutation(): UseMutationResult<void, unknown, LogoutRequestDTO> {
    return useMutation<void, unknown, LogoutRequestDTO>({ mutationFn: requestLogoutAsync });
}

export function useDeleteAccountMutation(): UseMutationResult<void, unknown, void> {
    return useMutation<void, unknown, void>({ mutationFn: requestDeleteAccountAsync });
}
