import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./localization/i18n";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";

export const API_URL = "https://mead-tools-api.vercel.app/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
