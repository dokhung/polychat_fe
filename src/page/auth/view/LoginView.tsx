import React from "react";

export const LoginView:React.FC = () => {
    return (
        <section className={"min-h-screen flex justify-center items-center"}>
            <div className={"w-full max-w-md"}>
                {/* UI */}
                <div>
                    <header className={"flex justify-center border"}>
                        <h1>Title</h1>
                    </header>
                </div>
                <div className={"border"}>
                    {/* ID */}
                    <div>
                        <label></label>
                    </div>
                    {/* PW */}
                    <div>PW</div>
                </div>
            </div>
        </section>
    )
}