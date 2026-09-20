import React from "react";
import chatMark from "../../../../assets/login/chat-mark.png";

const gemGlintClassName = "pointer-events-none absolute size-[23px] animate-[login-sparkle_4.8s_ease-in-out_infinite] bg-[radial-gradient(circle,#fff_0_8%,#d6fbff_12%,#95eaff80_32%,transparent_70%)] drop-shadow-[0_0_5px_#a1ecff] before:absolute before:inset-x-0 before:inset-y-[46%] before:rounded-[50%] before:bg-[linear-gradient(90deg,transparent,white,transparent)] before:content-[''] after:absolute after:inset-x-0 after:inset-y-[46%] after:rotate-90 after:rounded-[50%] after:bg-[linear-gradient(90deg,transparent,white,transparent)] after:content-[''] motion-reduce:hidden";

export const LoginBrand: React.FC = () => (
    <header className="flex flex-col items-center">
        <div className="relative animate-[login-float_7s_ease-in-out_infinite]" aria-hidden="true">
            <img className="block h-40 w-[218px] animate-[login-gem-glow_6s_ease-in-out_infinite] object-contain drop-shadow-[0_0_25px_#3b72e92e]
                min-[1500px]:h-[180px] min-[1500px]:w-[250px] [@media(width<=760px)]:h-[140px] [@media(width<=760px)]:w-[195px] login-short:h-[120px] login-short:w-[175px]" src={chatMark} alt="" />
            <span className="login-gem-mask pointer-events-none absolute inset-0 animate-[login-crystal-refraction_8s_ease-in-out_infinite] bg-[conic-gradient(from_215deg_at_36%_55%,transparent_0deg,#7c94ff55_50deg,transparent_65deg,#d5ffff80_115deg,transparent_132deg,#ae82ff66_200deg,transparent_230deg)] mix-blend-screen motion-reduce:opacity-30" />
            <span className="login-gem-mask pointer-events-none absolute inset-0 animate-[login-gem-sweep_6.5s_ease-in-out_infinite] [background:linear-gradient(112deg,transparent_34%,#bfefff08_40%,#d4faff66_46%,#ffffffdd_48%,#bfe9ff33_50%,transparent_54%,#bba5ff55_59%,transparent_63%)_140%_0/300%_100%] mix-blend-screen motion-reduce:hidden" />
            <i className={`${gemGlintClassName} top-[8%] left-[55%] [animation-delay:-0.5s]`} />
            <i className={`${gemGlintClassName} top-[77%] left-[12%] [animation-delay:-2.1s]`} />
            <i className={`${gemGlintClassName} top-[49%] right-[9%] [animation-delay:-3.6s]`} />
        </div>
        <h1 className="relative mt-1 mb-[13px] text-[clamp(60px,6.5vw,86px)] leading-none font-[750] tracking-[-5px] text-[#f0f4ff] [filter:drop-shadow(0_5px_2px_#020a2455)_drop-shadow(0_0_18px_#779fff33)]
            after:pointer-events-none after:absolute after:inset-0 after:animate-[login-glass-reflection_7s_ease-in-out_infinite] after:bg-[linear-gradient(110deg,transparent_35%,#ffffff0a_42%,#ffffffda_49%,#d7fbff99_51%,transparent_59%)] after:bg-size-[300%_100%] after:bg-position-[140%_0] after:bg-clip-text after:text-transparent after:content-[attr(data-text)]
            login-short:mb-2.5 login-short:text-[68px] motion-reduce:after:hidden" aria-label="polychat" data-text="polychat"><span className="bg-[linear-gradient(165deg,#ffffff_2%,#c6e4ffb0_31%,#f7fcff_43%,#6f99c375_47%,#bedbfa99_64%,#f4fbff_91%)] bg-clip-text text-transparent [-webkit-text-stroke:0.7px_#c9eaff9c]">poly</span><span className="bg-[linear-gradient(120deg,#75f2ffbb,#84aaff88_55%,#ba7bffa8),linear-gradient(165deg,#ffffff_2%,#c6e4ffb0_31%,#f7fcff_43%,#34579455_47%,#9ccfff99_64%,#f4fbff_91%)] bg-clip-text text-transparent [-webkit-text-stroke:0.7px_#c9eaff9c]">chat</span></h1>
        <p className="m-0 text-[10px] leading-[2] tracking-[4px] text-[#bddcff] [@media(width<=380px)]:text-[9px] [@media(width<=380px)]:tracking-[3px]">MORE PERSPECTIVES<br />BRIGHTER CONVERSATIONS</p>
    </header>
);
