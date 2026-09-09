import React, { useState } from "react";
import chatMark from "../../../assets/login/chat-mark.png";
import networkBackground from "../../../assets/login/network-background.png";
import "../css/LoginAnimetion.css";

const manifestoLines = {
    left: ["A NEW", "PERSPECTIVE", "STARTS", "WITH A CHAT"],
    right: ["SHARE", "YOUR IDEAS", "DISCOVER", "NEW PERSPECTIVES"],
};

const conversationNotes = [
    { position: "top-left", title: "A SIMPLE HELLO", delay: -2 },
    { position: "top-right", title: "STAY CURIOUS", delay: -10 },
    { position: "middle-left", title: "DIFFERENT MINDS.", delay: -5 },
    { position: "middle-right", title: "SHARED MOMENTS.", delay: -13 },
    { position: "bottom-left", title: "FIND YOUR PEOPLE", delay: -8 },
    { position: "bottom-right", title: "LET IDEAS GLOW", delay: -16 },
];

function TypedManifesto({ side }: { side: "left" | "right" }) {
    let characterIndex = 0;
    return (
        <aside className={`login-manifesto login-manifesto-${side}`} aria-label={manifestoLines[side].join(" ")}>
            <div className="login-typed-copy" aria-hidden="true">
                {manifestoLines[side].map((line) => (
                    <span className="login-typed-line" key={line}>
                        {Array.from(line).map((character, index) => (
                            <span className="login-typed-character" key={index} style={{ animationDelay: `${(side === "right" ? 10 : 0) + characterIndex++ * 0.085}s` }}>{character}</span>
                        ))}
                    </span>
                ))}
                <span className="login-light-line" />
            </div>
        </aside>
    );
}

// The SVG uses the same aspect ratio and crop as the background image.
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

export const LoginView: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Connect authClient here when the authentication API is implemented.
        setMessage("Login is not available yet. Please try again later.");
    };
    return (
        <main className="login-scene">
            <img className="login-landscape" src={networkBackground} alt="" aria-hidden="true" fetchPriority="high" />
            <svg className="login-floor-crystal" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
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
                    <polygon key={points} points={points} className="login-crystal-facet" style={{ animationDelay: `${-index * 0.67}s`, animationDuration: `${7 + index % 3}s` }} />
                ))}
            </svg>
            <svg className="login-floor-lights" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
                {floorLights.map(([x, y], index) => (
                    <g key={index} transform={`translate(${x} ${y})`}>
                        <g className="login-floor-spark" style={{ animationDelay: `${-index * 0.73}s`, animationDuration: `${4.5 + (index % 4) * 0.8}s`, color: index % 3 === 0 ? "#c9a7ff" : "#80eaff" }}>
                            <circle className="login-floor-halo" r="17" />
                            <path d="M0 -13 Q2 -2 13 0 Q2 2 0 13 Q-2 2 -13 0 Q-2 -2 0 -13Z" />
                            <circle r="2.5" fill="white" />
                        </g>
                    </g>
                ))}
            </svg>
            <TypedManifesto side="left" />
            <TypedManifesto side="right" />
            <div className="login-conversation-notes" aria-hidden="true">
                {conversationNotes.map(({ position, title, delay }) => (
                    <div className={`login-conversation-note login-note-${position}`} key={position} style={{ "--note-delay": `${delay}s` } as React.CSSProperties}>
                        <span className="login-note-node" />
                        <p className="login-note-title">{title}</p>
                    </div>
                ))}
            </div>
            <div className="login-content">
                <header className="login-brand">
                    <div className="login-gem" aria-hidden="true">
                        <img className="login-chat-mark" src={chatMark} alt="" />
                        <span className="login-gem-refraction" />
                        <span className="login-gem-reflection" />
                        <i className="login-gem-glint login-gem-glint-one" />
                        <i className="login-gem-glint login-gem-glint-two" />
                        <i className="login-gem-glint login-gem-glint-three" />
                    </div>
                    <h1 className="login-wordmark" aria-label="polychat" data-text="polychat"><span className="login-wordmark-poly">poly</span><span className="login-wordmark-chat">chat</span></h1>
                    <p className="login-tagline">MORE PERSPECTIVES<br />BRIGHTER CONVERSATIONS</p>
                </header>
                <section className="login-panel" aria-label="Log in">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label htmlFor="login-id">Username</label>
                            <input id="login-id" name="username" autoComplete="username" placeholder="Enter your username" required onChange={() => setMessage("")} />
                        </div>
                        <div className="login-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="login-password-wrap">
                                <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required onChange={() => setMessage("")} />
                                <button className="login-password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                        <circle cx="12" cy="12" r="3" />
                                        {showPassword && <path d="m3 3 18 18" />}
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button className="login-submit" type="submit">
                            <svg className="login-submit-gem" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="m7 3-5 6 10 12L22 9l-5-6H7Z" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M2 9h20M7 3l5 18 5-18M7 3l5 6 5-6" stroke="currentColor" strokeWidth="0.9" />
                            </svg>
                            <span className="login-submit-label">Log in</span>
                            <span className="login-submit-arrow" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                            </span>
                        </button>
                        {message && <p className="login-status" role="status">{message}</p>}
                    </form>
                </section>
                <footer className="login-footer"><span aria-hidden="true" /> EVERY CONVERSATION STARTS WITH YOU</footer>
            </div>
        </main>
    );
};
