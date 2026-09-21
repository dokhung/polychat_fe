import React, { useEffect } from "react";

type JoinMembershipModalProps = {
    onClose: () => void;
};

const signupInputClassName = "h-11 w-full rounded-lg border border-[#829dce55] bg-[#070f2480] px-3.5 text-[13px] text-[#f0f5ff] placeholder:text-[#8492ae] transition-[border-color,box-shadow] duration-[160ms] focus:border-[#6bcbff] focus:shadow-[0_0_0_3px_#58bbff1c] focus:outline-none";

export const JoinMembershipModal: React.FC<JoinMembershipModalProps> = ({ onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);

    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#020714b8] px-5 py-8 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="relative w-full max-w-[430px] rounded-[20px] border border-[#a9c9ff40] bg-[linear-gradient(145deg,#162a4ef5,#0b132cf5)] px-7 py-7 text-left shadow-[0_22px_70px_#02071499,inset_0_1px_0_#ffffff0d] backdrop-blur-[22px] [@media(width<=380px)]:px-5"
                role="dialog"
                aria-modal="true"
                aria-labelledby="signup-modal-title"
            >
                <button
                    className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-[#99accd] transition-colors hover:text-[#72e0f8]"
                    type="button"
                    onClick={onClose}
                    aria-label="Close sign up dialog"
                >
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                </button>

                <div className="mb-6 pr-8">
                    <p className="m-0 text-[10px] font-semibold tracking-[2.5px] text-[#72e0f8]">WELCOME TO POLYCHAT</p>
                    <h2 id="signup-modal-title" className="mt-2 mb-0 text-2xl font-semibold text-[#f0f5ff]">Create your account</h2>
                    <p className="mt-2 mb-0 text-xs leading-[1.6] text-[#adbbd5]">Enter your information to get started.</p>
                </div>

                <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
                    <label className="grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-username">
                        Username
                        <input className={signupInputClassName} id="signup-username" name="username" autoComplete="username" placeholder="Enter your username" />
                    </label>
                    <label className="grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-email">
                        Email
                        <input className={signupInputClassName} id="signup-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" />
                    </label>
                    <label className="grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-password">
                        Password
                        <input className={signupInputClassName} id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="Enter your password" />
                    </label>
                    <label className="grid gap-2 text-xs text-[#d1dbef]" htmlFor="signup-password-confirm">
                        Confirm password
                        <input className={signupInputClassName} id="signup-password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="Re-enter your password" />
                    </label>
                </form>
            </section>
        </div>
    );
};
