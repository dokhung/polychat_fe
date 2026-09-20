import React from "react";
import { LoginButton } from "./LoginButton";
import { SignupButton } from "../../signup/components/SignupButton";

const loginInputClassName = "block box-border h-[47px] w-full rounded-lg border border-[#829dce33] bg-[#070f2480] px-3.5 text-[13px] text-[#f0f5ff] transition-[border-color,box-shadow] duration-[160ms] ease-[ease] placeholder:text-[#8492ae] focus:border-[#6bcbff] focus:shadow-[0_0_0_3px_#58bbff1c] focus:outline-none";

type LoginFormProps = {
    showPassword: boolean;
    message: string;
    onTogglePassword: () => void;
    onClearMessage: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
    onSignup: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
    showPassword,
    message,
    onTogglePassword,
    onClearMessage,
    onSubmit,
    onSignup,
}) => (
    <section className="mt-[30px] rounded-[20px] border border-[#a9c9ff29] bg-[linear-gradient(145deg,#162a4ed9,#0b132ce8)] px-8 pt-7 pb-[30px] text-left shadow-[0_22px_70px_#0207144d,inset_0_1px_0_#ffffff06] backdrop-blur-[22px]
        [@media(width<=760px)]:mt-[26px] [@media(380px<width<=760px)]:px-6 [@media(380px<width<=760px)]:py-[25px] [@media(width<=380px)]:px-5 [@media(width<=380px)]:py-[23px] login-short:mt-5 login-short:pt-[22px] login-short:pb-6" aria-label="Log in">
        <form className="mt-0 grid gap-[18px] login-short:gap-3.5" onSubmit={onSubmit}>
            <div className="grid gap-2">
                <label className="text-xs leading-[1.5] text-[#d1dbef]" htmlFor="login-id">Username</label>
                <input className={loginInputClassName} id="login-id" name="username" autoComplete="username" placeholder="Enter your username" required onChange={onClearMessage} />
            </div>
            <div className="grid gap-2">
                <label className="text-xs leading-[1.5] text-[#d1dbef]" htmlFor="login-password">Password</label>
                <div className="relative">
                    <input className={`${loginInputClassName} pr-[50px]`} id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required onChange={onClearMessage} />
                    <button className="absolute top-0.5 right-0.5 grid size-[43px] cursor-pointer place-items-center rounded-md border-0 bg-transparent text-[#99accd] hover:text-[#72e0f8]" type="button" onClick={onTogglePassword} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                        <svg className="size-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{showPassword && <path d="m3 3 18 18" />}</svg>
                    </button>
                </div>
            </div>
            <LoginButton />
            {message && <p className="m-0 text-xs leading-[1.7] text-[#d5e4ff]" role="status">{message}</p>}
        </form>
        <div className="relative mt-3">
            <SignupButton onClick={onSignup} />
        </div>
    </section>
);
