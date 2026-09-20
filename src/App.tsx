import React from "react";
import {LoginView} from "./page/auth/login/view/LoginView.tsx";
import { Route,Routes } from "react-router-dom";

export function App() {
    return (
        <Routes>
            <Route path={"/"} element={<LoginView/>}/>
        </Routes>
    )
}
