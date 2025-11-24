import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FontProvider } from "./context/FontContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store/store"; // 🟢 ملف Redux الأساسي

import App from "./App";

// ===== Global CSS imports =====
import "./styles/theme.css";
import "./index.css";
import "./App.css";

// ===== Initialize React Query Client =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Data stays "fresh" for 5 minutes
      cacheTime: 30 * 60 * 1000,  // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetching on tab/window focus
      retry: 1,                    // Retry failed requests only once
    },
  },
});

// ===== Create React Root =====
const root = ReactDOM.createRoot(document.getElementById("root"));

// ===== Render Application =====
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <FontProvider>
            <QueryClientProvider client={queryClient}>
              <ReduxProvider store={store}> {/* 🟢 غلفنا App بالـ Redux */}
                <App />
              </ReduxProvider>
            </QueryClientProvider>
          </FontProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
