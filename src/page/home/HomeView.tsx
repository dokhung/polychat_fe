import type { NavigateFunction } from "react-router";
import type { StateTuple } from "../../types/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearTokens, getRefreshToken } from "../auth/common/client/authClient";
import { useCurrentUserQuery, useLogoutMutation } from "../../query/authQueries";
import { clearAuthQueries } from "../../query/queryClient";
import { HomeNavbar } from "./components/HomeNavbar";
import { HeroSection } from "./components/HeroSection";
import { FeatureSection } from "./components/FeatureSection";
import "./home.css";
import { getApiErrorMessage } from "../../common/errors/apiError";

export const HomeView: React.FC = (): React.JSX.Element => {
    const navigate: NavigateFunction = useNavigate();
    const [signedIn, setSignedIn]: StateTuple<boolean> = useState((): boolean => Boolean(getRefreshToken()));
    const [message, setMessage]: StateTuple<string> = useState("");
    const [heroVersion, setHeroVersion]: StateTuple<number> = useState(0);
    const returnHome: React.MouseEventHandler<HTMLAnchorElement> = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        setHeroVersion((version: number): number => version + 1);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    const userQuery: ReturnType<typeof useCurrentUserQuery> = useCurrentUserQuery(signedIn);
    const logoutMutation: ReturnType<typeof useLogoutMutation> = useLogoutMutation();
    const notice: string = message || (userQuery.isError ? getApiErrorMessage(userQuery.error, "USER_FETCH_FAILED") : "");
    useEffect((): () => void => {
        const update: () => void = (): void => { clearAuthQueries(); setSignedIn(Boolean(getRefreshToken())); };
        window.addEventListener("polychat:logout", update);
        window.addEventListener("storage", update);
        return (): void => { window.removeEventListener("polychat:logout", update); window.removeEventListener("storage", update); };
    }, []);
    const logout: () => Promise<void> = async (): Promise<void> => {
        if (logoutMutation.isPending) return;
        try { await logoutMutation.mutateAsync({ refreshToken: getRefreshToken() }); }
        catch (error: unknown) { setMessage(`${getApiErrorMessage(error, "LOGOUT_FAILED")} 이 브라우저에서는 로그아웃되었습니다.`); }
        finally { clearTokens(); setSignedIn(false); navigate("/"); }
    };
    return <main className="polychat-home">
        <HomeNavbar signedIn={signedIn} onLogout={logout} userEmail={userQuery.data?.email} onHome={returnHome} />
        {notice && <p className="home-notice" role="status">{notice}<button onClick={(): void => { setMessage(""); if (userQuery.isError) clearAuthQueries(); }} aria-label="알림 닫기">×</button></p>}
        <HeroSection key={heroVersion} signedIn={signedIn} />
        <FeatureSection />
        <section className="home-container developer-section" id="developers"><p className="home-eyebrow">FOR THE BUILDERS</p><h2>Connection is<br />a shared language.</h2><p>Interested in building with PolyChat?<br />Explore the product as we shape what comes next.</p><a className="home-secondary" href="#features">Explore the experience ↗</a><span className="developer-code" aria-hidden="true">&lt;hello world /&gt;</span></section>
        <section className="home-container about-section" id="about"><p className="home-eyebrow">THIS IS POLYCHAT</p><h2>The world has a lot to say.<br /><em>Let's understand each other.</em></h2><p>AI-powered communication. Human connection.</p>{!signedIn && <Link className="home-primary" to="/login?mode=signup">Join the conversation ↗</Link>}</section>
        <footer className="home-container home-footer"><Link to="/home" onClick={returnHome} className="home-logo">◈ polychat.</Link><span>MORE PERSPECTIVES. BRIGHTER CONVERSATIONS.</span><span>© {new Date().getFullYear()} PolyChat</span></footer>
    </main>;
};
