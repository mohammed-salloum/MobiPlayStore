// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

// ملفات CSS العالمية
import "./styles/theme.css";
import "./index.css";
import "./App.css";

// إنشاء React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // البيانات تبقى حديثة لمدة 5 دقائق
      cacheTime: 30 * 60 * 1000, // cache لمدة 30 دقيقة
      refetchOnWindowFocus: false, // منع إعادة الجلب عند رجوع focus للنافذة
      retry: 1, // إعادة محاولة واحدة فقط عند الفشل
    },
  },
});

// إنشاء root
const root = ReactDOM.createRoot(document.getElementById("root"));

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
