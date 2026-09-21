import type { StateTuple } from "../../../types/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type HomeNavbarProps = { signedIn: boolean; userEmail: string | undefined; onLogout: () => void; onHome: React.MouseEventHandler<HTMLAnchorElement> };
export function HomeNavbar({ signedIn, userEmail, onLogout, onHome }: HomeNavbarProps): React.JSX.Element {
    const userName: string = userEmail?.split("@")[0] || "사용자";
    const [open, setOpen]: StateTuple<boolean> = useState(false);
    const [scrolled, setScrolled]: StateTuple<boolean> = useState(false);
    useEffect((): () => void => {
        const update: () => void = (): void => setScrolled(window.scrollY > 24);
        update(); window.addEventListener("scroll", update, { passive: true });
        return (): void => window.removeEventListener("scroll", update);
    }, []);
    useEffect((): () => void => {
        const escape: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => { if (event.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", escape);
        return (): void => window.removeEventListener("keydown", escape);
    }, []);
    return <header className={`home-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="home-nav" aria-label="Main navigation">
            <Link to="/home" className="home-logo" onClick={(event: React.MouseEvent<HTMLAnchorElement>): void => { setOpen(false); onHome(event); }}><span className="home-logo-mark">◈</span> polychat<span className="logo-dot">.</span></Link>
            <button className="home-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="home-navigation" onClick={(): void => setOpen(!open)}>{open ? "✕" : "☰"}</button>
            <div id="home-navigation" className={`home-nav-content ${open ? "is-open" : ""}`}>
                <div className="home-nav-links">{["Product", "Features", "Developers", "About"].map((label: string): React.JSX.Element => <a key={label} href={`#${label.toLowerCase()}`} onClick={(): void => setOpen(false)}>{label}</a>)}</div>
                <div className="home-nav-actions">{signedIn ? <><button onClick={onLogout}>로그아웃</button><div className="home-user" title={userEmail} aria-label={userEmail ? `로그인한 사용자: ${userEmail}` : "사용자 정보 확인 중"}><span className="home-user-avatar" aria-hidden="true">{userName.slice(0, 1).toUpperCase()}</span><span className="home-user-details"><span className="home-user-status">SIGNED IN</span><strong>{userEmail ? userName : "확인 중…"}</strong></span><span className="home-user-dot" aria-hidden="true" /></div></> : <><Link to="/login">Sign In</Link><Link className="home-nav-join" to="/login?mode=signup">Join Free <span>↗</span></Link></>}</div>
            </div>
        </nav>
    </header>;
}
