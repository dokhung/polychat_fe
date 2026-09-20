import React from "react";
import networkBackground from "../../../../assets/login/network-background.png";

const manifestoLines = {
    left: ["A NEW", "PERSPECTIVE", "STARTS", "WITH A CHAT"],
    right: ["SHARE", "YOUR IDEAS", "DISCOVER", "NEW PERSPECTIVES"],
};

const conversationNotes = [
    { position: "top-left", className: "top-[5%] left-[18%] [@media(width<=1100px)]:left-[4%]", title: "A SIMPLE HELLO", delay: -2 },
    { position: "top-right", className: "top-[6%] right-[12%] [@media(width<=1100px)]:right-[3%]", title: "STAY CURIOUS", delay: -10 },
    { position: "middle-left", className: "top-[46%] left-[5%]", title: "DIFFERENT MINDS.", delay: -5 },
    { position: "middle-right", className: "top-[46%] right-[4%]", title: "SHARED MOMENTS.", delay: -13 },
    { position: "bottom-left", className: "top-[77%] left-[11%] [@media(width<=1100px)]:left-[4%]", title: "FIND YOUR PEOPLE", delay: -8 },
    { position: "bottom-right", className: "top-[79%] right-[8%] [@media(width<=1100px)]:right-[3%]", title: "LET IDEAS GLOW", delay: -16 },
];

const floorLights = [
    [50, 394], [96, 527], [224, 649], [275, 770], [485, 864],
    [505, 751], [746, 843], [951, 916], [1045, 790], [1202, 742],
    [1330, 720], [1438, 899], [1355, 565], [1575, 379], [1595, 541],
];

const floorFacets = [
    "0,570 96,527 42,678", "96,527 224,649 42,678",
    "42,678 224,649 275,770", "224,649 275,770 505,751",
    "0,759 275,770 0,941", "275,770 485,864 505,751",
    "505,751 640,903 746,843", "746,843 951,916 1058,814",
    "951,916 1252,876 1058,814", "1058,814 1202,742 1252,876",
    "1202,742 1330,720 1252,876", "1330,720 1438,899 1252,876",
    "1330,720 1595,541 1672,564", "1330,720 1672,840 1438,899",
];

function TypedManifesto({ side }: { side: "left" | "right" }) {
    let characterIndex = 0;
    return (
        <aside className={`absolute top-[17%] z-[2] text-[11px] leading-[2.4] tracking-[5px] text-[#82b7ed] [@media(width<=1000px)]:text-[9px] [@media(width<=1000px)]:tracking-[3px] [@media(width<=760px)]:hidden ${side === "left" ? "left-[7.5%] [@media(width<=1000px)]:left-[4%]" : "right-[6%] [@media(width<=1000px)]:right-[3%]"}`} aria-label={manifestoLines[side].join(" ")}>
            <div className={`animate-[login-copy-turn_20s_linear_infinite_both] motion-reduce:opacity-100 ${side === "right" ? "[animation-delay:10s]" : ""}`} aria-hidden="true">
                {manifestoLines[side].map((line) => (
                    <span className="block whitespace-pre" key={line}>
                        {Array.from(line).map((character, index) => (
                            <span className="animate-[login-type-character_20s_steps(1,end)_infinite] opacity-0 motion-reduce:opacity-100" key={index} style={{ animationDelay: `${(side === "right" ? 10 : 0) + characterIndex++ * 0.085}s` }}>{character}</span>
                        ))}
                    </span>
                ))}
                <span className="mt-5 block h-0.5 w-[39px] bg-[linear-gradient(90deg,#40e7f9,#aa72ff)] shadow-[0_0_9px_#49c5ff70]" />
            </div>
        </aside>
    );
}

export const LoginBackground: React.FC = () => (
    <>
        <img className="pointer-events-none absolute inset-0 z-0 size-full max-w-none object-cover object-bottom" src={networkBackground} alt="" aria-hidden="true" fetchPriority="high" />
        <svg className="pointer-events-none absolute inset-0 z-[1] size-full mix-blend-screen" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <defs>
                <linearGradient id="floor-crystal-face" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e5ffff" stopOpacity="0.65" />
                    <stop offset="0.3" stopColor="#70dbff" stopOpacity="0.08" />
                    <stop offset="0.52" stopColor="#afb8ff" stopOpacity="0.32" />
                    <stop offset="0.56" stopColor="#efffff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#8660ff" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {floorFacets.map((points, index) => (
                <polygon key={points} points={points} className="animate-[login-facet-reflection_8s_ease-in-out_infinite] fill-[url(#floor-crystal-face)] stroke-[#b2e9ff] stroke-[0.7] opacity-[0.16] [stroke-opacity:0.45] motion-reduce:opacity-20" style={{ animationDelay: `${-index * 0.67}s`, animationDuration: `${7 + index % 3}s` }} />
            ))}
        </svg>
        <svg className="pointer-events-none absolute inset-0 z-[1] size-full motion-reduce:hidden" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            {floorLights.map(([x, y], index) => (
                <g key={index} transform={`translate(${x} ${y})`}>
                    <g className={`origin-center animate-[login-sparkle_5s_ease-in-out_infinite] fill-current [transform-box:fill-box] ${index % 3 === 0 ? "text-[#c9a7ff]" : "text-[#80eaff]"}`} style={{ animationDelay: `${-index * 0.73}s`, animationDuration: `${4.5 + (index % 4) * 0.8}s` }}>
                        <circle className="opacity-[0.32] blur-[7px]" r="17" />
                        <path d="M0 -13 Q2 -2 13 0 Q2 2 0 13 Q-2 2 -13 0 Q-2 -2 0 -13Z" />
                        <circle r="2.5" fill="white" />
                    </g>
                </g>
            ))}
        </svg>
        <TypedManifesto side="left" />
        <TypedManifesto side="right" />
        <div className="pointer-events-none absolute inset-0 z-[2] [@media(width<=900px)]:hidden" aria-hidden="true">
            {conversationNotes.map(({ position, title, delay, className }) => (
                <div className={`absolute w-[210px] animate-[login-note-arrive_18s_ease-in-out_var(--note-delay)_infinite_both] pl-[15px] [@media(width<=1100px)]:w-[165px] motion-reduce:transform-none motion-reduce:opacity-75 ${className}`} key={position} style={{ "--note-delay": `${delay}s` } as React.CSSProperties}>
                    <span className="absolute top-[5px] left-0 size-1 rotate-45 bg-[#99e7ff] shadow-[0_0_9px_#87dfff90]" />
                    <p className="m-0 animate-[login-note-type_18s_steps(22,end)_var(--note-delay)_infinite_both] text-[9px] leading-[1.6] font-medium tracking-[2.3px] whitespace-nowrap text-[#c4deff] [clip-path:inset(0_100%_0_0)] [@media(width<=1100px)]:text-[8px] [@media(width<=1100px)]:tracking-[1.3px] motion-reduce:[clip-path:none]">{title}</p>
                </div>
            ))}
        </div>
    </>
);
