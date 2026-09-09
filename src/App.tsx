import React from "react";
import {LoginView} from "./page/auth/view/LoginView.tsx";
import { Route,Routes } from "react-router-dom";

export function App() {
    return (
        <Routes>
            <Route path={"/"} element={<LoginView/>}/>
        </Routes>
    )
}