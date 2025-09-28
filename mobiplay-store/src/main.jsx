import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

// ===== Global CSS imports =====
import "./styles/theme.css";
import "./index.css";
import "./App.css";

// ===== Initialize React Query Client =====
// Configures global defaults for server-state management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Data stays "fresh" for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetching on tab/window focus
      retry: 1,                   // Retry failed requests only once
    },
  },
});

// ===== Create React Root =====
const root = ReactDOM.createRoot(document.getElementById("root"));

// ===== Render Application =====
// Wraps the App component with:
// - BrowserRouter: enables client-side routing
// - LanguageProvider: manages multilingual support
// - ThemeProvider: manages light/dark theme state
// - CartProvider: manages shopping cart state
// - QueryClientProvider: provides React Query for server data caching
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </CartProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
