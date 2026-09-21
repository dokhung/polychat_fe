import type { StateTuple } from "../../types/react";
import React, {createContext, type RefObject, useCallback, useContext, useRef, useState} from "react";
import type { ReactNode } from "react";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import { SpaceWarpTransition } from "./SpaceWarpTransition";
import {
    useLocation,
    type Location as RouterLocation,
} from "react-router";

interface SpaceWarpContextValue {
    isWarping: boolean;
    startWarp: (destination: string) => void;
}

const SpaceWarpContext: React.Context<SpaceWarpContextValue | null> = createContext<SpaceWarpContextValue | null>(null);

interface SpaceWarpProviderProps {
    children: ReactNode;
}

export function SpaceWarpProvider({ children }: SpaceWarpProviderProps): React.JSX.Element {
    const [destination, setDestination]: StateTuple<string | null> = useState<string | null>(null);
    const locked:RefObject<boolean> = useRef(false);
    const navigate:NavigateFunction = useNavigate();
    const location:RouterLocation = useLocation();
    const arrived:boolean = destination !== null && location.pathname === destination;
    const startWarp: (target: string) => void = useCallback((target: string):void => {
        if (locked.current) return;
        locked.current = true;
        setDestination(target);
    }, []);
    const complete: () => void = (): void => {
        locked.current = false;
        setDestination(null);
    };

    return (
        <SpaceWarpContext.Provider value={{ isWarping: destination !== null, startWarp }}>
            <div className={destination && !arrived ? "warp-page warp-page-departing" : "warp-page"} inert={destination !== null}>
                {children}
            </div>
            {destination && (
                <SpaceWarpTransition
                    arrived={arrived}
                    onPeak={(): void | Promise<void> => navigate(destination)}
                    onComplete={complete}
                />
            )}
        </SpaceWarpContext.Provider>
    );
}

export function useSpaceWarp(): SpaceWarpContextValue {
    const context: SpaceWarpContextValue | null = useContext(SpaceWarpContext);
    if (!context) throw new Error("useSpaceWarp requires SpaceWarpProvider");
    return context;
}
