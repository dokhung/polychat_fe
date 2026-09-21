import type { StateTuple } from "../../../types/react";
import React, { Component, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { NetworkSphere } from "./NetworkSphere";

function Fallback(): React.JSX.Element {
    return <div className="network-fallback" role="img" aria-label="Connected AI network sphere"><span /><span /><span /><b>AI</b></div>;
}

type SceneBoundaryProps = { children: ReactNode };
type SceneBoundaryState = { failed: boolean };
const SCENE_SIZE: number = 900;

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
    state: SceneBoundaryState = { failed: false };
    static getDerivedStateFromError(): SceneBoundaryState { return { failed: true }; }
    render(): ReactNode { return this.state.failed ? <Fallback /> : this.props.children; }
}

export default function NetworkScene(): React.JSX.Element {
    const container: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const surface: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const [active, setActive]: StateTuple<boolean> = useState(true);
    const [reducedMotion, setReducedMotion]: StateTuple<boolean> = useState((): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    useLayoutEffect((): (() => void) | undefined => {
        const viewport: HTMLDivElement | null = container.current;
        const scene: HTMLDivElement | null = surface.current;
        if (!viewport || !scene) return;
        const fit: () => void = (): void => {
            const scale: number = Math.min(viewport.clientWidth, viewport.clientHeight) / SCENE_SIZE;
            scene.style.transform = `translate(-50%, -50%) scale(${scale})`;
        };
        fit();
        const observer: ResizeObserver = new ResizeObserver(fit);
        observer.observe(viewport);
        return (): void => observer.disconnect();
    }, []);
    useEffect((): () => void => {
        let inView: boolean = true;
        const update: () => void = (): void => setActive(inView && !document.hidden);
        const observer: IntersectionObserver = new IntersectionObserver(([entry]: IntersectionObserverEntry[]): void => {
            if (!entry) return;
            inView = entry.isIntersecting;
            update();
        });
        if (container.current) observer.observe(container.current);
        document.addEventListener("visibilitychange", update);
        update();
        return (): void => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", update);
        };
    }, []);
    useEffect((): () => void => {
        const media: MediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update: () => void = (): void => setReducedMotion(media.matches);
        media.addEventListener("change", update);
        return (): void => media.removeEventListener("change", update);
    }, []);
    // Keep the drawing buffer and camera aspect stable throughout expansion and collapse.
    return <div ref={container} className="network-scene-viewport">
        <div ref={surface} className="network-scene-surface" style={{ width: SCENE_SIZE, height: SCENE_SIZE }}>
        <SceneBoundary><Canvas camera={{ position: [0, 0, 7.7], fov: 44 }} dpr={[1, 1.5]}
        resize={{ offsetSize: true, debounce: 0 }}
        frameloop={!active ? "never" : reducedMotion ? "demand" : "always"} fallback={<Fallback />} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 4]} intensity={3} color="#c0eaff" />
        <pointLight position={[-3, -1, 2]} intensity={8} color="#8877dd" />
        <NetworkSphere reducedMotion={reducedMotion} />
    </Canvas></SceneBoundary></div></div>;
}
