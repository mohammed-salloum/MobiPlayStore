import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageContext } from "./context/LanguageContext";
import { ThemeContext } from "./context/ThemeContext";

// ===== Shared Layout Components =====
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LanguageHandler from "./components/common/LanguageHandler/LanguageHandler";

// ===== Pages =====
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import Checkout from "./pages/Checkout/Checkout";
import Offers from "./pages/Offers/Offers";
import FAQ from "./pages/FAQ/FAQ";
import Reviews from "./pages/Reviews/Reviews";

// ===== React Query Services =====
import { useProducts, useOffers } from "./services/api";
import { useQueryClient } from "@tanstack/react-query";

// ===== Toast Notifications =====
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { language: currentLang } = useContext(LanguageContext); // Current app language
  const { theme } = useContext(ThemeContext);                   // Current theme (light/dark)

  const queryClient = useQueryClient(); // React Query cache manager

  // ===== Apply selected font on app load =====
  useEffect(() => {
    const selectedFont = localStorage.getItem("selectedFont") || "inter";
    const fontMap = {
      inter: "'Inter', sans-serif",
      roboto: "'Roboto', sans-serif",
      lato: "'Lato', sans-serif",
      montserrat: "'Montserrat', sans-serif",
    };
    document.body.style.setProperty("--main-font", fontMap[selectedFont] || fontMap.inter);
  }, []);

  // ===== Invalidate cache when language changes =====
  // Forces refetch of products & offers when the user switches language
  useEffect(() => {
    queryClient.invalidateQueries(["products"]);
    queryClient.invalidateQueries(["offers"]);
  }, [currentLang, queryClient]);

  // ===== Data Fetch Hooks =====
  // Automatically fetch products and offers on app load
  useProducts();
  useOffers();

  return (
    <div
      data-theme={theme} // Theme applied through CSS [data-theme]
      dir={currentLang === "ar" ? "rtl" : "ltr"} // RTL for Arabic, LTR otherwise
      className="app"
    >
      <Navbar />

      {/* ===== App Routes ===== */}
      <main className="main-content">
        <Routes>
          {/* Redirect root to localized path */}
          <Route path="/" element={<Navigate to={`/${currentLang}/`} replace />} />

          {/* Language-aware routes */}
          <Route path="/:lang/*" element={<LanguageHandler />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="offers" element={<Offers />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="cart" element={<Cart />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </main>

      <Footer />

      {/* ===== Toast Notifications ===== */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={currentLang === "ar"} // RTL for Arabic notifications
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
