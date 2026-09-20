import React from "react";

export type AuthButtonProps = {
    type?: "button" | "submit";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
};

export const AuthButton: React.FC<AuthButtonProps & { label: string }> = ({
    type = "button",
    onClick,
    disabled = false,
    label,
}) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="group relative isolate flex h-[54px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-[11px] border border-transparent text-sm leading-[1.5] font-semibold text-white
            [background:linear-gradient(115deg,#245e83,#3f53a0_53%,#65449b)_padding-box,linear-gradient(125deg,#c4f6ff,#75c3ff88_35%,#b9a0f0_80%,#e4cfff)_border-box]
            shadow-[inset_0_1px_0_#ffffff66,inset_0_-3px_0_#10204655,0_7px_22px_#4772f033,0_1px_3px_#020a2780] [text-shadow:0_1px_5px_#17306680] transition-[transform,box-shadow,filter] duration-[180ms] ease-[ease]
            before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:bg-[linear-gradient(175deg,#d8fbff33,#ffffff05_48%,#07163622_50%,#8494ff11)] before:content-['']
            after:pointer-events-none after:absolute after:inset-0 after:animate-[login-button-sheen_6s_ease-in-out_infinite] after:[background:linear-gradient(110deg,transparent_35%,#ddfaff06_43%,#e3faff66_49%,#ffffff11_54%,transparent_62%)_140%_0/300%_100%] after:content-['']
            hover:[transform:translateY(-2px)] hover:brightness-115 hover:shadow-[inset_0_1px_0_#ffffff88,inset_0_-3px_0_#10204644,0_10px_28px_#568af055,0_0_15px_#8edaff22]
            active:[transform:translateY(1px)] active:brightness-103 active:shadow-[inset_0_2px_5px_#14245666,0_3px_12px_#4772f033] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:after:hidden"
    >
        <svg className="absolute left-[17px] size-5 text-[#c0f3ff] drop-shadow-[0_0_5px_#8fe8ff66]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m7 3-5 6 10 12L22 9l-5-6H7Z" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 9h20M7 3l5 18 5-18M7 3l5 6 5-6" stroke="currentColor" strokeWidth="0.9" />
        </svg>
        <span className="relative text-sm leading-[1.5] font-[650] tracking-[2px]">{label}</span>
        <span className="absolute right-[11px] grid size-[30px] place-items-center rounded-[7px] border border-[#dfecff30] bg-[#d8dbff0d] text-xl leading-[1.5] font-normal transition-[transform,background] duration-[180ms] ease-[ease] group-hover:[transform:translateX(2px)] group-hover:bg-[#e0eaff20]" aria-hidden="true">
            <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </span>
    </button>
);
