import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import React from "react"
import {App} from "./App.tsx";
import './style.css'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/queryClient";

createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <Provider store={store}>
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
        </QueryClientProvider>
        </Provider>
    </StrictMode>,
)
