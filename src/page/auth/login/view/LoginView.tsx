import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { LoginBackground } from "../components/LoginBackground";
import { LoginBrand } from "../components/LoginBrand";
import { LoginForm } from "../components/LoginForm";
import "../css/LoginAnimetion.css";

export const LoginView: React.FC = () => {
    const introRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const intro = introRef.current;
        if (!intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const animation = animate(intro.querySelectorAll<HTMLElement>("[data-login-intro]"), {
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 900,
            delay: stagger(110),
            ease: "out(4)",
        });

        return () => {
            animation.pause();
        };
    }, []);

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Connect authClient here when the authentication API is implemented.
        setMessage("Login is not available yet. Please try again later.");
    };

    const handleSignup = () => {
        // Connect the signup route or modal here when the membership flow is implemented.
        setMessage("Sign up is not available yet. Please try again later.");
    };

    return (
        <main className="relative isolate flex min-h-svh justify-center overflow-hidden bg-[#070f24] px-6 pt-[38px] pb-[30px] font-login text-[#f0f5ff]
            after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgb(5_12_30_/_8%),rgb(5_12_30_/_12%)_50%,rgb(5_12_30_/_35%))] after:content-['']
            [@media(width<=760px)]:px-5 [@media(width<=760px)]:py-7 login-short:py-[22px]
            [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[#a3eaff] [&_button:focus-visible]:outline-offset-4
            motion-reduce:[&_*]:animate-none! motion-reduce:[&_*]:transition-none motion-reduce:[&_*::before]:animate-none! motion-reduce:[&_*::before]:transition-none motion-reduce:[&_*::after]:animate-none! motion-reduce:[&_*::after]:transition-none">
            <LoginBackground />
            <div ref={introRef} className="relative z-[2] my-auto w-full max-w-[440px] text-center">
                <div data-login-intro>
                    <LoginBrand />
                </div>
                <div data-login-intro>
                    <LoginForm
                        showPassword={showPassword}
                        message={message}
                        onTogglePassword={() => setShowPassword((visible) => !visible)}
                        onClearMessage={() => setMessage("")}
                        onSubmit={handleSubmit}
                        onSignup={handleSignup}
                    />
                </div>
                <footer className="mt-[25px] flex items-center justify-center gap-[9px] text-[8px] tracking-[2px] text-[#adbbd5] [@media(width<=380px)]:tracking-[1.2px] login-short:mt-[18px]" data-login-intro>
                    <span className="size-1 rounded-full bg-[#67d6ee] shadow-[0_0_9px_#55cfff]" aria-hidden="true" /> EVERY CONVERSATION STARTS WITH YOU
                </footer>
            </div>
        </main>
    );
};
