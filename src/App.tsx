import React, { lazy, Suspense } from "react";
import {LoginView} from "./page/auth/login/view/LoginView.tsx";
import { Route,Routes } from "react-router-dom";
import { HomeView } from "./page/home/HomeView";
const MySpaceView = lazy(() => import('./page/space/MySpaceView').then(module => ({ default: module.MySpaceView })));
import { SpaceWarpProvider } from "./components/transition/SpaceWarpProvider";

export function App(): React.JSX.Element {
    return (
        <SpaceWarpProvider>
        <Routes>
            <Route path={"/"} element={<LoginView/>}/>
            <Route path={"/login"} element={<LoginView/>}/>
            <Route path={"/home"} element={<HomeView/>}/>
            <Route path={"/space"} element={<Suspense fallback={<div style={{ background: '#111426', color: '#d5c4e9', minHeight: '100vh', display: 'grid', placeItems: 'center' }} role="status">Opening your universe…</div>}><MySpaceView/></Suspense>}/>
        </Routes>
        </SpaceWarpProvider>
    )
}
