import type { StateTuple } from "../../../types/react";
import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
const NetworkScene: React.LazyExoticComponent<() => React.JSX.Element> = lazy((): Promise<typeof import("./NetworkScene")> => import("./NetworkScene"));

type HeroSectionProps = { signedIn: boolean };

export function HeroSection({ signedIn }: HeroSectionProps): React.JSX.Element {
    const [expanded, setExpanded]: StateTuple<boolean> = useState(false);
    const [leaving, setLeaving]: StateTuple<boolean> = useState(false);
    const sectionRef: React.RefObject<HTMLElement | null> = useRef<HTMLElement>(null);
    const networkRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const stageRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const previousBounds: React.RefObject<DOMRect | null> = useRef<DOMRect | null>(null);
    const expandTriggerRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const changeExpanded: (next: boolean) => void = (next: boolean): void => {
        if (leaving) return;
        if (next && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setLeaving(true);
            return;
        }
        previousBounds.current = stageRef.current?.getBoundingClientRect() ?? null;
        setExpanded(next);
    };

    useEffect((): (() => void) | undefined => {
        if (!leaving) return;
        const timer: number = window.setTimeout((): void => {
            previousBounds.current = stageRef.current?.getBoundingClientRect() ?? null;
            setExpanded(true);
            setLeaving(false);
        }, 180);
        return (): void => window.clearTimeout(timer);
    }, [leaving]);

    useLayoutEffect((): (() => void) | undefined => {
        const before: DOMRect | null = previousBounds.current;
        const network: HTMLDivElement | null = networkRef.current;
        previousBounds.current = null;
        const stage: HTMLDivElement | null = stageRef.current;
        if (!before || !network || !stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const after: DOMRect = network.getBoundingClientRect();
        if (!after.width || !after.height) return;

        // Interpolate the actual viewport, avoiding a non-uniform scale of the sphere.
        const animations: Animation[] = [stage.animate([
            {
                width: `${before.width}px`, height: `${before.height}px`,
                transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)`,
            },
            { width: `${after.width}px`, height: `${after.height}px`, transform: "none" },
        ], { duration: 720, easing: "cubic-bezier(0.22, 1, 0.36, 1)" })];

        if (!expanded) {
            sectionRef.current?.querySelectorAll<HTMLElement>(".hero-copy, .hero-actions").forEach((element: HTMLElement): void => {
                animations.push(element.animate([
                    { opacity: 0, transform: "translateX(-18px)" },
                    { opacity: 1, transform: "none" },
                ], { duration: 420, delay: 180, fill: "backwards", easing: "ease-out" }));
            });
        }
        return (): void => animations.forEach((animation: Animation): void => animation.cancel());
    }, [expanded]);

    useEffect((): (() => void) | undefined => {
        if (!expanded) return;
        const handleEscape: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            if (event.key !== "Escape") return;
            previousBounds.current = stageRef.current?.getBoundingClientRect() ?? null;
            setExpanded(false);
            expandTriggerRef.current?.focus({ preventScroll: true });
        };
        window.addEventListener("keydown", handleEscape);
        return (): void => window.removeEventListener("keydown", handleEscape);
    }, [expanded]);

    return <section ref={sectionRef} className={`home-hero home-container${expanded ? " is-network-expanded" : ""}${leaving ? " is-network-leaving" : ""}`} id="product">
        <div className="hero-copy" inert={expanded || leaving}>
            <p className="home-eyebrow hero-enter"><span /> CONVERSATIONS WITHOUT BORDERS</p>
            <h1 className="hero-enter">One world.<br />Every language.<br /><em>One conversation.</em></h1>
            <p className="hero-description hero-enter">AI-powered communication that connects<br className="desktop-break" /> people beyond language barriers.</p>
        </div>
        <div ref={networkRef} className="hero-network" id="hero-network" role="group" aria-label="Interactive AI network sphere"
            onClick={(): void => {
                changeExpanded(!expanded);
            }}>
            <div ref={stageRef} className="network-stage">
            <div ref={expandTriggerRef} className="network-canvas" role="button" aria-expanded={expanded}
                tabIndex={0} aria-label={expanded ? "네트워크 구체 축소" : "네트워크 구체 확대"}
                onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        changeExpanded(!expanded);
                    }
                }}><Suspense fallback={<div className="network-loading">Connecting perspectives…</div>}><NetworkScene /></Suspense></div>
            <div className="network-caption"><span className="network-dot" /> POLYCHAT INTELLIGENCE <span className="caption-divider">/</span> CONNECTED BY DESIGN</div>
            <div className="network-tag tag-one"><span>あ</span> Hello, world.</div>
            <div className="network-tag tag-two"><span>↗</span> Beyond language.</div>
            </div>
        </div>
        <div className="hero-actions hero-enter" inert={expanded || leaving}>
            {signedIn ? <Link to="/space" className="home-launch">
                <span className="home-launch-icon" aria-hidden="true">▶</span>
                <span className="home-launch-copy"><span>ENTER YOUR SPACE</span><strong>나의 공간으로 이동</strong></span>
                <span className="home-launch-arrow" aria-hidden="true">↗</span>
            </Link> : <Link to="/login?mode=signup" className="home-primary">Start Chatting <span>↗</span></Link>}
            <a href="#features" className="home-secondary">Learn More <span>↓</span></a>
            <p>Different languages. Shared understanding.</p>
        </div>
        <div className="hero-bottom"><span>BUILT FOR A MORE CONNECTED WORLD</span><a href="#features">SCROLL TO EXPLORE <span>↓</span></a></div>
    </section>;
}
