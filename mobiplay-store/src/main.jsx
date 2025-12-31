import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ===== Context Providers =====
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FontProvider } from "./context/FontContext";

// ===== React Query =====
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ===== Redux =====
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store/store"; // Main Redux store

import App from "./App";

// ===== Global CSS imports =====
import "./styles/theme.css";  // Theme-related global styles
import "./index.css";         // General global styles
import "./App.css";           // App-specific styles

// ===== Initialize React Query Client with default options =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Data remains fresh for 5 minutes
      cacheTime: 30 * 60 * 1000,  // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Avoid automatic refetch on window/tab focus
      retry: 1,                    // Retry failed requests only once
    },
  },
});

// ===== Create React Root =====
const root = ReactDOM.createRoot(document.getElementById("root"));

// ===== Render Application =====
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables routing in the app */}
    <BrowserRouter>
      {/* Context providers for language, theme, and font management */}
      <LanguageProvider>
        <ThemeProvider>
          <FontProvider>
            {/* React Query provider for async data fetching and caching */}
            <QueryClientProvider client={queryClient}>
              {/* Redux provider for global state management */}
              <ReduxProvider store={store}>
                <App /> {/* Main application component */}
              </ReduxProvider>
            </QueryClientProvider>
          </FontProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
