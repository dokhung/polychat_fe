/** Frontend error codes. These are not a backend response contract. */
export type ErrorCode =
    | "API_REQUEST_FAILED" | "NETWORK_ERROR" | "REQUEST_TIMEOUT" | "REQUEST_CANCELLED"
    | "INVALID_REQUEST" | "AUTH_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT"
    | "TOO_MANY_REQUESTS" | "SERVER_ERROR" | "INVALID_CREDENTIALS" | "EMAIL_ALREADY_EXISTS"
    | "SESSION_EXPIRED" | "INVALID_REFRESH_TOKEN" | "LOGIN_FAILED" | "SIGNUP_FAILED"
    | "EMAIL_CHECK_FAILED" | "REFRESH_FAILED" | "LOGOUT_FAILED" | "DELETE_ACCOUNT_FAILED"
    | "USER_FETCH_FAILED" | "INVALID_EMAIL" | "INVALID_PASSWORD" | "PASSWORD_CONFIRM_REQUIRED"
    | "INVALID_SECONDARY_PASSWORD" | "PASSWORD_MISMATCH" | "EMAIL_CHECK_REQUIRED";

export const ERROR_MESSAGES: Readonly<Record<ErrorCode, string>> = {
    API_REQUEST_FAILED: "API 호출에 실패했습니다.",
    NETWORK_ERROR: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
    REQUEST_TIMEOUT: "요청 시간이 초과되었습니다. 다시 시도해주세요.",
    REQUEST_CANCELLED: "요청이 취소되었습니다.",
    INVALID_REQUEST: "입력값을 확인해주세요.",
    AUTH_REQUIRED: "로그인이 필요합니다.",
    FORBIDDEN: "이 작업을 수행할 권한이 없습니다.",
    NOT_FOUND: "요청한 정보를 찾을 수 없습니다.",
    CONFLICT: "현재 상태에서는 요청을 처리할 수 없습니다.",
    TOO_MANY_REQUESTS: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
    EMAIL_ALREADY_EXISTS: "이미 가입된 이메일입니다.",
    SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
    INVALID_REFRESH_TOKEN: "유효하지 않은 리프레시 토큰입니다. 다시 로그인해주세요.",
    LOGIN_FAILED: "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.",
    SIGNUP_FAILED: "가입에 실패했습니다.",
    EMAIL_CHECK_FAILED: "이메일 중복확인에 실패했습니다.",
    REFRESH_FAILED: "인증 갱신에 실패했습니다. 다시 로그인해주세요.",
    LOGOUT_FAILED: "서버 로그아웃 처리에 실패했습니다.",
    DELETE_ACCOUNT_FAILED: "회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.",
    USER_FETCH_FAILED: "사용자 정보를 불러오지 못했습니다.",
    INVALID_EMAIL: "올바른 이메일을 입력해주세요.",
    INVALID_PASSWORD: "비밀번호는 영문과 숫자를 모두 포함한 6~64자로 입력해주세요.",
    PASSWORD_CONFIRM_REQUIRED: "비밀번호 확인을 입력해주세요.",
    INVALID_SECONDARY_PASSWORD: "2차 비밀번호는 영문과 숫자를 모두 포함한 4~64자로 입력해주세요.",
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    EMAIL_CHECK_REQUIRED: "이메일 중복확인을 먼저 완료해주세요.",
};

export function isErrorCode(value: unknown): value is ErrorCode {
    return typeof value === "string" && Object.hasOwn(ERROR_MESSAGES, value);
}
