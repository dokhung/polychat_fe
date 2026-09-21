import type { LoginResponseDTO } from "../dto/response/LoginResponseDTO";
import type { JSAnimation } from "animejs";

import type { SetURLSearchParams } from "react-router";
import type { StateTuple } from "../../../../types/react";
import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { LoginBackground } from "../components/LoginBackground";
import { LoginBrand } from "../components/LoginBrand";
import { LoginForm } from "../components/LoginForm";
import { LoginLoadingModal } from "../components/LoginLoadingModal";
import { SignupForm } from "../../signup/components/SignupForm";
import "../css/LoginAnimetion.css";
import { saveTokens } from "../../common/client/authClient";
import { useLoginMutation } from "../../../../query/authQueries";
import { clearAuthQueries } from "../../../../query/queryClient";
import { getApiErrorMessage } from "../../../../common/errors/apiError";
import { useSearchParams } from "react-router-dom";
import { useSpaceWarp } from "../../../../components/transition/SpaceWarpProvider";
import type { LoginRequestDTO } from "../dto/request/LoginRequestDTO";


export const LoginView: React.FC = (): React.JSX.Element => {
    const introRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword]: StateTuple<boolean> = useState(false);
    const [message, setMessage]: StateTuple<string> = useState("");
    const [searchParams]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
    const [isSignup, setIsSignup]: StateTuple<boolean> = useState((): boolean => searchParams.get("mode") === "signup");
    const formsRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const hasSwitched: React.RefObject<boolean> = useRef(false);
    const { startWarp, isWarping }: ReturnType<typeof useSpaceWarp> = useSpaceWarp();
    const submitting: React.RefObject<boolean> = useRef(false);
    const loginMutation: ReturnType<typeof useLoginMutation> = useLoginMutation();

    useEffect((): (() => void) | undefined => {
        if (!hasSwitched.current) return;
        const timer: number = window.setTimeout((): void => {
            const panel: HTMLElement | null | undefined = formsRef.current?.querySelector<HTMLElement>(`[data-auth-panel="${isSignup ? "signup" : "login"}"]`);
            panel?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
        }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 680);
        return (): void => window.clearTimeout(timer);
    }, [isSignup]);

    useEffect((): (() => void) | undefined => {
        const intro: HTMLDivElement | null = introRef.current;
        if (!intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const animation: JSAnimation = animate(intro.querySelectorAll<HTMLElement>("[data-login-intro]"), {
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 900,
            delay: stagger(110),
            ease: "out(4)",
        });

        return (): void => {
            animation.pause();
        };
    }, []);

    const handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => Promise<void> = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (submitting.current || isWarping) return;
        submitting.current = true;
        setMessage("");
        const form: FormData = new FormData(event.currentTarget);
        const request: LoginRequestDTO = {
            email: String(form.get("email")),
            password: String(form.get("password")),
        };
        try {
            const response: LoginResponseDTO = await loginMutation.mutateAsync(request);
            clearAuthQueries();
            saveTokens(response);
            startWarp("/home");
        }
        catch (error: unknown) { setMessage(getApiErrorMessage(error, "LOGIN_FAILED")); }
        finally { submitting.current = false; }
    };

    const handleSignup: () => void = (): void => {
        hasSwitched.current = true;
        setIsSignup(true);
    };

    return (
        <main className="relative isolate flex min-h-svh justify-center overflow-hidden bg-[#070f24] px-6 pt-[38px] pb-[30px] font-login text-[#f0f5ff]
            after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgb(5_12_30_/_8%),rgb(5_12_30_/_12%)_50%,rgb(5_12_30_/_35%))] after:content-['']
            [@media(width<=760px)]:px-5 [@media(width<=760px)]:py-7 login-short:py-[22px]
            [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[#a3eaff] [&_button:focus-visible]:outline-offset-4
            motion-reduce:[&_*]:animate-none! motion-reduce:[&_*]:transition-none motion-reduce:[&_*::before]:animate-none! motion-reduce:[&_*::before]:transition-none motion-reduce:[&_*::after]:animate-none! motion-reduce:[&_*::after]:transition-none">
            <LoginBackground />
            <div ref={introRef} className={`auth-scene relative z-[2] my-auto w-full max-w-[440px] text-center ${isSignup ? "auth-scene-signup" : ""}`}>
                <div data-login-intro>
                    <div ref={formsRef} className="auth-switch" data-mode={isSignup ? "signup" : "login"}>
                    <div className="auth-panel auth-panel-login" data-auth-panel="login" inert={isSignup} aria-hidden={isSignup}>
                    <div className="auth-panel-inner">
                    <LoginBrand />
                    <LoginForm
                        showPassword={showPassword}
                        message={message}
                        onTogglePassword={(): void => setShowPassword((visible: boolean): boolean => !visible)}
                        onClearMessage={(): void => setMessage("")}
                        onSubmit={handleSubmit}
                        onSignup={handleSignup}
                    />
                    </div>
                    </div>
                    <div className="auth-panel auth-panel-signup" data-auth-panel="signup" inert={!isSignup} aria-hidden={!isSignup}>
                        <div className="auth-panel-inner">
                            <SignupForm onBack={(): void => { hasSwitched.current = true; setIsSignup(false); }} />
                        </div>
                    </div>
                    </div>
                </div>
                <footer className="mt-[25px] flex items-center justify-center gap-[9px] text-[8px] tracking-[2px] text-[#adbbd5] [@media(width<=380px)]:tracking-[1.2px] login-short:mt-[18px]" data-login-intro>
                    <span className="size-1 rounded-full bg-[#67d6ee] shadow-[0_0_9px_#55cfff]" aria-hidden="true" /> EVERY CONVERSATION STARTS WITH YOU
                </footer>
            </div>
            {loginMutation.isPending && <LoginLoadingModal />}
        </main>
    );
};
