import React, { useEffect, Suspense, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import SettingsModal from "./components/SettingsModal/SettingsModal";
import LanguageHandler from "./components/Common/LanguageHandler/LanguageHandler";
import useScrollToTop from "./hooks/useScrollToTop";
import useAutoPageTitle from "./hooks/useAutoPageTitle";

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
import SignIn from "./pages/SignIn/SignIn";
import Profile from "./pages/Profile/Profile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/Common/ProtectedRoute/ProtectedRoute.jsx";
import { useProducts, useOffers } from "./services/api";
import { loadUserData, handleLogout } from "./services/cartService";

// ===== Redux slices =====
import { selectUser, login } from "./redux/slices/userSlice";
import { setUser, selectCartItems } from "./redux/slices/cartSlice";
import { setReviewsDirect } from "./redux/slices/reviewsSlice";


function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ===== Redux state =====
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);

  // ===== Local state =====
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");

  useScrollToTop();
  useAutoPageTitle({ skip: showSettings });

  // ===== Set font based on language =====
  const getFontByLanguage = (lang) =>
    lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  useEffect(() => {
    const family = getFontByLanguage(language);
    setFontFamily(family);
    document.documentElement.style.setProperty("--main-font", family);
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", family);
  }, [language, fontSize]);

  // ===== Invalidate queries when language changes =====
  useEffect(() => {
    queryClient.invalidateQueries(["products"]);
    queryClient.invalidateQueries(["offers"]);
  }, [language, queryClient]);

  useProducts();
  useOffers();

  // ===== Load user data / reset cart & reviews on logout =====
useEffect(() => {
  if (user) {
    // المستخدم سجل دخول → تحميل سلة وتقييمات
    loadUserData(user, dispatch);
  } else {
    // تسجيل خروج → استرجاع guest
    dispatch(setUser(null)); // ← استعمل setUser بدل setCartUser
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
    dispatch(setReviewsDirect(JSON.parse(localStorage.getItem("reviews_guest")) || {}));
  }
}, [user, dispatch]);


  return (
    <div data-theme={theme} dir={language === "ar" ? "rtl" : "ltr"} className="app">
     <Navbar 
        openSettings={() => setShowSettings(true)} 
        onLogout={() => handleLogout(cartItems, dispatch, navigate, language)} 
      /> 

      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${language}/`} replace />} />
            <Route path="/:lang/*" element={<LanguageHandler />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="offers" element={<Offers />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="reviews" element={<Reviews />} />
              <Route
                path="cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="login" element={<SignIn />} />
              <Route path="register" element={<SignIn />} />
              <Route path="reset-password" element={<SignIn />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="profile"
                element={user ? <Profile /> : <Navigate to={`/${language}/login`} replace />}
              />
            </Route>
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={language === "ar"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
