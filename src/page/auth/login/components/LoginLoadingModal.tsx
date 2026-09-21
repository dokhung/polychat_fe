import React, { useLayoutEffect, useRef } from "react";
import "../css/LoginLoadingModal.css";

export function LoginLoadingModal(): React.JSX.Element {
    const dialogRef: React.RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);

    useLayoutEffect((): (() => void) | undefined => {
        const dialog: HTMLDialogElement | null = dialogRef.current;
        if (!dialog) return;
        dialog.showModal();
        return (): void => dialog.close();
    }, []);

    return (
        <dialog ref={dialogRef} className="login-loading-modal" aria-labelledby="login-loading-title"
            aria-describedby="login-loading-description" onCancel={(event: React.SyntheticEvent<HTMLDialogElement>): void => event.preventDefault()}>
            <div className="login-loading-orbit" aria-hidden="true">
                <span className="login-loading-ring" />
                <svg viewBox="0 0 32 32" fill="none">
                    <path d="m16 4 12 12-12 12L4 16 16 4Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.3" />
                    <path d="m16 10 6 6-6 6-6-6 6-6Z" fill="currentColor" />
                </svg>
            </div>
            <p className="login-loading-label">POLYCHAT</p>
            <h2 id="login-loading-title">로그인 중입니다.</h2>
            <p id="login-loading-description">계정을 확인하고 있습니다.<br />잠시만 기다려주세요.</p>
            <div className="login-loading-progress" aria-hidden="true"><span /></div>
        </dialog>
    );
}
