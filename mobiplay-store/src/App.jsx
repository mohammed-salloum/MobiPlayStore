import { useEffect, Suspense, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";

// ===== Layout Components =====
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import SettingsModal from "./components/SettingsModal/SettingsModal";
import LanguageHandler from "./components/Common/LanguageHandler/LanguageHandler";

// ===== Custom Hooks =====
import useScrollToTop from "./hooks/useScrollToTop"; // Scrolls to top on route change
import useAutoPageTitle from "./hooks/useAutoPageTitle"; // Dynamically updates page title

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
import SignIn from "./pages/SignIn/SignIn";
import Profile from "./pages/Profile/Profile";

// ===== Notifications =====
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===== Route Protection =====
import ProtectedRoute from "./components/Common/ProtectedRoute/ProtectedRoute.jsx";

// ===== API hooks =====
import { useProducts, useOffers } from "./services/api";

// ===== Services =====
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
  const user = useSelector(selectUser);        // Currently logged-in user
  const cartItems = useSelector(selectCartItems); // Items in cart

  // ===== Local state =====
  const [showSettings, setShowSettings] = useState(false); // Settings modal visibility
  const [language, setLanguage] = useState("en");          // Current app language
  const [theme, setTheme] = useState("light");            // Theme (light/dark)
  const [fontSize, setFontSize] = useState(16);           // Base font size
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif"); // Font family

  // ===== Custom Hooks =====
  useScrollToTop(); // Scrolls to top on route change
  useAutoPageTitle({ skip: showSettings }); // Updates page title unless settings modal is open

  // ===== Font Management based on Language =====
  const getFontByLanguage = (lang) =>
    lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  useEffect(() => {
    const family = getFontByLanguage(language);
    setFontFamily(family);

    // Apply font and font size to root element
    document.documentElement.style.setProperty("--main-font", family);
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);

    // Persist font settings in localStorage
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", family);
  }, [language, fontSize]);

  // ===== Invalidate cached queries on language change =====
  useEffect(() => {
    queryClient.invalidateQueries(["products"]);
    queryClient.invalidateQueries(["offers"]);
  }, [language, queryClient]);

  // ===== Fetch initial data =====
  useProducts();
  useOffers();

  // ===== Load user data or reset cart/reviews on logout =====
  useEffect(() => {
    if (user) {
      // User is logged in → load cart and reviews
      loadUserData(user, dispatch);
    } else {
      // User logged out → revert to guest data
      dispatch(setUser(null));
      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
      dispatch(setReviewsDirect(JSON.parse(localStorage.getItem("reviews_guest")) || {}));
    }
  }, [user, dispatch]);

  return (
    <div data-theme={theme} dir={language === "ar" ? "rtl" : "ltr"} className="app">
      {/* ===== Navbar with Settings & Logout ===== */}
      <Navbar 
        openSettings={() => setShowSettings(true)} 
        onLogout={() => handleLogout(cartItems, dispatch, navigate, language)} 
      /> 

      {/* ===== Main Routes ===== */}
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Redirect root path to language-specific home */}
            <Route path="/" element={<Navigate to={`/${language}/`} replace />} />

            {/* All language-handled routes */}
            <Route path="/:lang/*" element={<LanguageHandler />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="offers" element={<Offers />} />
              <Route path="faq" element={<FAQ />} />

              {/* Protected cart route */}
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

              {/* Profile route redirects to login if not authenticated */}
              <Route
                path="profile"
                element={user ? <Profile /> : <Navigate to={`/${language}/login`} replace />}
              />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {/* ===== Footer ===== */}
      <Footer />

      {/* ===== Settings Modal ===== */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      )}

      {/* ===== Toast Notifications ===== */}
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
