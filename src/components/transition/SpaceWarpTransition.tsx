import type { StateTuple } from "../../types/react";
import React, {type RefObject, useEffect, useRef, useState} from "react";
import "./space-warp.css";

interface SpaceWarpTransitionProps {
    arrived: boolean;
    onPeak: () => void;
    onComplete: () => void;
}

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
}

type WarpCallbacks = {
    onPeak: () => void;
    onComplete: () => void;
}

export function SpaceWarpTransition({ arrived, onPeak, onComplete }: SpaceWarpTransitionProps): React.JSX.Element {
    const canvasRef:RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null);
    const flashRef:RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const callbacks: React.RefObject<WarpCallbacks> = useRef<WarpCallbacks>({ onPeak, onComplete });
    callbacks.current = { onPeak, onComplete };
    const [reducedMotion]: StateTuple<boolean> = useState(():boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    useEffect(():void | (()=>void) => {
        if (!arrived) return;
        const timer: number = window.setTimeout((): void => callbacks.current.onComplete(), reducedMotion ? 180 : 420);
        return ():void => window.clearTimeout(timer);
    }, [arrived, reducedMotion]);

    useEffect((): void | (() => void) => {
        // A calm, non-flashing alternative for motion-sensitive users.
        if (reducedMotion) {
            const timer: number = window.setTimeout(
                (): void => callbacks.current.onPeak(),
                180,
            );

            return (): void => {
                window.clearTimeout(timer);
            };
        }

        const canvas: HTMLCanvasElement | null = canvasRef.current;

        const context: CanvasRenderingContext2D | null =
            canvas?.getContext("2d") ?? null;

        if (!canvas || !context) {
            const timer: number = window.setTimeout(
                (): void => callbacks.current.onPeak(),
                1580,
            );

            return (): void => {
                window.clearTimeout(timer);
            };
        }

        let width: number = 0;
        let height: number = 0;

        const resize: () => void = (): void => {
            width = window.innerWidth;
            height = window.innerHeight;

            const dpr: number = Math.min(
                window.devicePixelRatio || 1,
                1.5,
            );

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            context.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            );
        };

        resize();

        window.addEventListener("resize", resize);

        const stars: Star[] = Array.from(
            {
                length: width < 600 ? 230 : 460,
            },
            (): Star => {
                const angle: number = Math.random() * Math.PI * 2;

                const radius: number =
                    0.06 +
                    Math.pow(Math.random(), 0.65) * 1.7;

                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    z: 0.15 + Math.random() * 2.7,
                    size: 0.4 + Math.random() * 1.2,
                };
            },
        );

        let frame: number = 0;
        let start: number | undefined = undefined;
        let previous: number = 0;

        const draw: (now: DOMHighResTimeStamp) => void = (now: DOMHighResTimeStamp): void => {
            start ??= now;

            const elapsed: number = now - start;

            const delta: number = Math.min(
                (now - (previous || now)) / 1000,
                0.04,
            );

            previous = now;

            const acceleration: number = Math.pow(
                Math.min(
                    Math.max(
                        (elapsed - 250) / 1200,
                        0,
                    ),
                    1,
                ),
                2.6,
            );

            const speed: number =
                0.06 + acceleration * 5.5;

            const focal: number =
                Math.min(width, height) * 0.58;

            context.clearRect(
                0,
                0,
                width,
                height,
            );

            context.globalAlpha = Math.min(
                elapsed / 400,
                1,
            );

            context.lineCap = "round";

            for (const star of stars) {
                star.z -= speed * delta;

                if (star.z < 0.05) {
                    star.z = 2.8;
                }

                const x: number =
                    width / 2 +
                    (star.x / star.z) * focal;

                const y: number =
                    height / 2 +
                    (star.y / star.z) * focal;

                const tailZ: number =
                    star.z +
                    0.003 +
                    acceleration * 0.65;

                const tailX: number =
                    width / 2 +
                    (star.x / tailZ) * focal;

                const tailY: number =
                    height / 2 +
                    (star.y / tailZ) * focal;

                const opacity: number = Math.min(
                    0.95,
                    0.3 + 0.6 / star.z,
                );

                context.strokeStyle =
                    `rgba(175,225,255,${opacity})`;

                context.lineWidth =
                    star.size *
                    (0.5 + acceleration * 0.8);

                context.beginPath();
                context.moveTo(tailX, tailY);
                context.lineTo(x, y);
                context.stroke();
            }

            const flash: HTMLDivElement | null =
                flashRef.current;

            if (flash) {
                const flashProgress: number = Math.max(
                    0,
                    Math.min(
                        (elapsed - 1250) / 330,
                        1,
                    ),
                );

                const flashOpacity: number =
                    Math.pow(flashProgress, 3);

                flash.style.opacity =
                    String(flashOpacity);
            }

            if (elapsed >= 1580) {
                callbacks.current.onPeak();
                return;
            }

            frame = window.requestAnimationFrame(draw);
        };

        frame = window.requestAnimationFrame(draw);

        return (): void => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener(
                "resize",
                resize,
            );
        };
    }, [reducedMotion]);

    return (
        <div className={`space-warp ${arrived ? "space-warp-arrived" : ""} ${reducedMotion ? "space-warp-reduced" : ""}`}>
            <span className="space-warp-status" role="status">로그인 성공. 홈으로 이동 중입니다.</span>
            <div className="space-warp-space" aria-hidden="true" />
            <canvas ref={canvasRef} className="space-warp-stars" aria-hidden="true" />
            <div className="space-warp-core" aria-hidden="true" />
            <div ref={flashRef} className="space-warp-flash" aria-hidden="true" />
        </div>
    );
}
