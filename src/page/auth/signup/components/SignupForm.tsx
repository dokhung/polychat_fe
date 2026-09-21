import type { SignupResponseDTO } from "../dto/response/SignupResponseDTO";
import type { EmailAvailabilityResponseDTO } from "../dto/response/EmailAvailabilityResponseDTO";
import type { NavigateFunction } from "react-router";
import type { StateTuple } from "../../../../types/react";
import React from "react";
import { InputBorderTrail } from "./InputBorderTrail";
import { saveTokens } from "../../common/client/authClient";
import { useSignupMutation, useEmailAvailabilityQuery } from "../../../../query/authQueries";
import { clearAuthQueries } from "../../../../query/queryClient";

import { useNavigate } from "react-router-dom";
import type { SignupRequestDTO } from "../dto/request/SignupRequestDTO";

import { getApiErrorMessage } from "../../../../common/errors/apiError";
import { ERROR_MESSAGES } from "../../../../common/errors/errorCodes";

type SignupFormProps = {
    onBack: () => void;
};

const signupInputClassName: string = "h-11 w-full rounded-lg border border-transparent bg-[#070f2480] px-3.5 text-[13px] text-[#f0f5ff] placeholder:text-[#8492ae] focus:outline-none";
type SignupField = keyof SignupRequestDTO | "passwordConfirm";
type SignupFieldErrors = Partial<Record<SignupField, string>>;
type EmailValidationStatus = "idle" | "success" | "error";

const validationMessages: Record<SignupField, string> = {
    email: ERROR_MESSAGES.INVALID_EMAIL,
    password: ERROR_MESSAGES.INVALID_PASSWORD,
    passwordConfirm: ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED,
    secondaryPassword: ERROR_MESSAGES.INVALID_SECONDARY_PASSWORD,
};

function isSignupField(name: string): name is SignupField {
    return Object.hasOwn(validationMessages, name);
}

const sanitizeEmail: (value: string) => string = (value: string): string => value.replace(/[^A-Za-z.@]/g, "");

export const SignupForm: React.FC<SignupFormProps> = ({ onBack }: SignupFormProps): React.JSX.Element => {
    const [message, setMessage]: StateTuple<string> = React.useState("");
    const [emailMessage, setEmailMessage]: StateTuple<string> = React.useState("");
    const [fieldErrors, setFieldErrors]: StateTuple<SignupFieldErrors> = React.useState<SignupFieldErrors>({});
    const emailVersion: React.RefObject<number> = React.useRef(0);
    const signupMutation: ReturnType<typeof useSignupMutation> = useSignupMutation();
    const loading: boolean = signupMutation.isPending;
    const [email, setEmail]: StateTuple<string> = React.useState("");
    const emailQuery: ReturnType<typeof useEmailAvailabilityQuery> = useEmailAvailabilityQuery(email);
    const checkingEmail: boolean = emailQuery.isFetching;
    const [emailChecked, setEmailChecked]: StateTuple<boolean> = React.useState(false);
    const [emailAvailable, setEmailAvailable]: StateTuple<boolean> = React.useState(false);
    const [emailResult, setEmailResult]: StateTuple<EmailValidationStatus> = React.useState<EmailValidationStatus>("idle");
    const [password, setPassword]: StateTuple<string> = React.useState("");
    const [passwordConfirm, setPasswordConfirm]: StateTuple<string> = React.useState("");
    const passwordsMatch: boolean = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,64}$/.test(password)
        && password === passwordConfirm;
    const navigate: NavigateFunction = useNavigate();

    const handleInvalid: (event: React.InvalidEvent<HTMLFormElement>) => void = (event: React.InvalidEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const input: EventTarget = event.target;
        if (!(input instanceof HTMLInputElement) || !isSignupField(input.name)) return;
        const field: SignupField = input.name;
        if (input.name === "email") {
            setEmailMessage(validationMessages.email);
        } else {
            setFieldErrors((errors: SignupFieldErrors): SignupFieldErrors => ({ ...errors, [field]: validationMessages[field] }));
        }
    };

    const handleFieldChange: (event: React.FormEvent<HTMLFormElement>) => void = (event: React.FormEvent<HTMLFormElement>): void => {
        const input: EventTarget = event.target;
        if (!(input instanceof HTMLInputElement) || !isSignupField(input.name)) return;
        setMessage("");
        setFieldErrors((errors: SignupFieldErrors): SignupFieldErrors => ({
            ...errors,
            [input.name]: "",
            ...(input.name === "password" ? { passwordConfirm: "" } : {}),
        }));
    };

    const checkEmail: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void> = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const form: HTMLFormElement | null = event.currentTarget.form;
        const email: string = sanitizeEmail(String(new FormData(form ?? undefined).get("email") ?? "").trim());
        const version: number = ++emailVersion.current;
        setEmailChecked(false);
        setEmailAvailable(false);
        setEmailResult("idle");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailMessage(ERROR_MESSAGES.INVALID_EMAIL);
            setEmailResult("error");
            setEmailChecked(false);
            return;
        }


        setEmailMessage("이메일 확인 중입니다...");
        try {
            const result: Awaited<ReturnType<typeof emailQuery.refetch>> = await emailQuery.refetch({ throwOnError: true });
            const response: EmailAvailabilityResponseDTO | undefined = result.data;
            if (!response) return;
            if (version !== emailVersion.current) return;
            setEmailChecked(true);
            setEmailAvailable(response.available);
            setEmailResult(response.available ? "success" : "error");
            setEmailMessage(response.available ? response.message : ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        } catch (error: unknown) {
            if (version !== emailVersion.current) return;
            setEmailChecked(false);
            setEmailMessage(getApiErrorMessage(error, "EMAIL_CHECK_FAILED"));
            setEmailResult("error");
        }
    };

    const handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => Promise<void> = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (loading) return;
        const data: FormData = new FormData(event.currentTarget);

        if (!emailChecked || !emailAvailable) {
            setEmailMessage(ERROR_MESSAGES.EMAIL_CHECK_REQUIRED);
            return;
        }

        if (data.get("password") !== data.get("passwordConfirm")) {
            setFieldErrors((errors: SignupFieldErrors): SignupFieldErrors => ({ ...errors, passwordConfirm: ERROR_MESSAGES.PASSWORD_MISMATCH }));
            return;
        }

        try {
            const request: SignupRequestDTO = {
                email: String(data.get("email") ?? ""),
                password: String(data.get("password") ?? ""),
                secondaryPassword: String(data.get("secondaryPassword") ?? ""),
            };
            const response: SignupResponseDTO = await signupMutation.mutateAsync(request);
            clearAuthQueries();
            saveTokens(response);
            navigate("/home");
        } catch (error: unknown) {
            setMessage(getApiErrorMessage(error, "SIGNUP_FAILED"));
        }
    };

    return (
            <section
                className="relative w-full rounded-[20px] border border-[#a9c9ff40] bg-[linear-gradient(145deg,#162a4ef5,#0b132cf5)] px-7 py-7 text-left shadow-[0_22px_70px_#02071499,inset_0_1px_0_#ffffff0d] backdrop-blur-[22px] [@media(width<=380px)]:px-5"
                aria-labelledby="signup-title"
            >
                <button
                    className="mb-5 flex items-center gap-2 text-xs text-[#99accd] transition-colors hover:text-[#72e0f8] disabled:opacity-50"
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                >
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="m12 5-7 7 7 7M5 12h14" />
                    </svg>
                    로그인으로 돌아가기
                </button>

                <div className="signup-heading mb-6 pr-8">
                    <p className="m-0 text-[10px] font-semibold tracking-[2.5px] text-[#72e0f8]">WELCOME TO POLYCHAT</p>
                    <h2 id="signup-title" className="mt-2 mb-0 text-2xl font-semibold text-[#f0f5ff]">Create your account</h2>
                    <p className="mt-2 mb-0 text-xs leading-[1.6] text-[#adbbd5]">Enter your information to get started.</p>
                </div>

                <form className="signup-form grid gap-4" onSubmit={handleSubmit} onInvalid={handleInvalid} onChange={handleFieldChange}>
                    <label className="signup-field grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-email">
                        Email
                        <div className="flex gap-2">
                            <div className="signup-input-frame min-w-0 flex-1" data-validation={emailResult}>
                                <InputBorderTrail />
                                <input className={`${signupInputClassName} min-w-0`} id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required pattern="[A-Za-z.]+@[A-Za-z.]+" aria-describedby="signup-email-message" onBeforeInput={(event: React.InputEvent<HTMLInputElement>): void => { const data: string | null = event.nativeEvent.data; if (data && /[^A-Za-z.@]/.test(data)) event.preventDefault(); }} onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void => { event.currentTarget.value = sanitizeEmail(event.currentTarget.value); setEmail(event.currentTarget.value); emailVersion.current++; setEmailResult("idle"); setEmailMessage(""); setEmailChecked(false); setEmailAvailable(false); }} />
                            </div>
                            <button className="h-11 shrink-0 rounded-lg border border-[#72e0f888] bg-[#72e0f815] px-3 text-[11px] font-semibold text-[#9defff] transition hover:bg-[#72e0f82c] disabled:opacity-50" type="button" onClick={checkEmail} disabled={checkingEmail}>{checkingEmail ? "확인 중" : "중복확인"}</button>
                        </div>
                        <span id="signup-email-message" role="status" className={emailAvailable || checkingEmail ? "text-[#9defff]" : "text-[#ffb7c0]"}>{emailMessage}</span>
                    </label>
                    <label className="signup-field grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-password">
                        Password
                        <div className="signup-input-frame" data-validation={passwordsMatch ? "success" : "idle"}>
                            <InputBorderTrail />
                            <input className={signupInputClassName} id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="영문+숫자 6자 이상" required pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,64}" aria-describedby="signup-password-message" aria-invalid={!!fieldErrors.password} value={password} onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void => setPassword(event.currentTarget.value)} />
                        </div>
                        <span id="signup-password-message" role="status" className="text-[#ffb7c0]">{fieldErrors.password}</span>
                    </label>
                    <label className="signup-field grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-password-confirm">
                        Confirm password
                        <div className="signup-input-frame" data-validation={passwordsMatch ? "success" : "idle"}>
                            <InputBorderTrail />
                            <input className={signupInputClassName} id="signup-password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="Re-enter your password" required aria-describedby="signup-confirm-message" aria-invalid={!!fieldErrors.passwordConfirm} value={passwordConfirm} onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void => setPasswordConfirm(event.currentTarget.value)} />
                        </div>
                        <span id="signup-confirm-message" role="status" className={passwordsMatch ? "text-[#9defff]" : "text-[#ffb7c0]"}>{passwordsMatch ? "비밀번호가 일치합니다." : fieldErrors.passwordConfirm}</span>
                    </label>
                    <label className="signup-field grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-secondary">
                        Secondary password
                        <span className="text-[10px] text-[#8492ae]">Optional · 영문+숫자</span>
                        <div className="signup-input-frame">
                            <InputBorderTrail />
                            <input className={signupInputClassName} id="signup-secondary" name="secondaryPassword" type="password" placeholder="선택 입력" pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,64}" aria-describedby="signup-secondary-message" aria-invalid={!!fieldErrors.secondaryPassword} />
                        </div>
                        <span id="signup-secondary-message" role="status" className="text-[#ffb7c0]">{fieldErrors.secondaryPassword}</span>
                    </label>
                    {(message || loading) && <p className="m-0 text-xs text-[#9defff]" role="status">{loading ? "가입 처리 중입니다..." : message}</p>}
                    <button className="signup-submit h-11 rounded-lg border-0 bg-[linear-gradient(100deg,#51bdf8,#8a7dff)] font-semibold text-[#071024] transition-transform hover:-translate-y-0.5 disabled:opacity-60" disabled={loading} type="submit">
                        {loading ? "Creating..." : "Create account"}
                    </button>
                </form>
            </section>
    );
};
