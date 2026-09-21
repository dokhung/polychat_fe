import type { JSAnimation } from "animejs";
import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

type Feature = { number: string; title: string; label: string; description: string; from: string; to: string; meta: string; };

const features: Feature[] = [
    { number: "01", title: "Your words.\nTheir language.", label: "INSTANT TRANSLATION", description: "Communicate naturally across multiple languages. Let your ideas lead the conversation, not the language you speak.", from: "Hello! Great to meet you.", to: "안녕하세요! 만나서 반가워요.", meta: "ENGLISH → 한국어" },
    { number: "02", title: "A little assistance.\nA better conversation.", label: "AI CONVERSATION", description: "Find the right words with AI. Bring clarity, context, and a more natural tone to the moments that matter.", from: "Help me make this sound warmer.", to: "I'd love to hear your perspective.", meta: "YOUR IDEAS → A LITTLE MORE CLARITY" },
    { number: "03", title: "Different places.\nCommon ground.", label: "GLOBAL COMMUNITY", description: "Connect with people around the world. Explore different perspectives and discover how much we have in common.", from: "東京 · Seoul · Barcelona", to: "One conversation can open a world.", meta: "MANY PERSPECTIVES → ONE CONNECTION" },
];

export function FeatureSection(): React.JSX.Element {
    const root: React.RefObject<HTMLElement | null> = useRef<HTMLElement>(null);
    useEffect((): (() => void) | undefined => {
        if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const animations: ReturnType<typeof animate>[] = [];
        const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => entries.forEach((entry: IntersectionObserverEntry): void => {
            if (!entry.isIntersecting) return;
            animations.push(animate(entry.target.querySelectorAll("[data-reveal]"), { opacity: [0, 1], translateY: [22, 0], duration: 800, delay: stagger(100), ease: "out(3)" }));
            observer.unobserve(entry.target);
        }), { threshold: .18 });
        root.current.querySelectorAll(".feature-row").forEach((row: Element): void => observer.observe(row));
        return (): void => { observer.disconnect(); animations.forEach((animation: JSAnimation): JSAnimation => animation.pause()); };
    }, []);
    return <section ref={root} className="home-features home-container" id="features">
        <div className="features-heading"><p className="home-eyebrow">LESS FRICTION. MORE CONNECTION.</p><h2>Made for understanding.</h2></div>
        {features.map((feature: Feature): React.JSX.Element => <article className="feature-row" key={feature.number}>
            <div className="feature-copy" data-reveal><span className="feature-number">{feature.number}</span><p className="home-eyebrow">{feature.label}</p><h3>{feature.title}</h3><p>{feature.description}</p></div>
            <div className="feature-demo" data-reveal><div className="demo-heading"><span className="network-dot" /> {feature.label}<span>ILLUSTRATION</span></div><div className="demo-message">{feature.from}</div><div className="demo-connector">✦</div><div className="demo-message demo-reply">{feature.to}</div><div className="demo-meta">{feature.meta}</div></div>
        </article>)}
    </section>;
}
