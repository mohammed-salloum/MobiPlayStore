import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Checkout from './pages/Checkout';
import Offers from './pages/Offers';
import FAQ from './pages/Faq';
import Reviews from './components/Reviews/Reviews';
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import './App.css';
import { ThemeContext } from './context/ThemeContext';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { darkMode } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  // أسماء قصيرة للخطوط (لا تحتوي مسافات أو فواصل)
  const [font, setFont] = useState(localStorage.getItem('selectedFont') || 'inter');

  useEffect(() => {
    // إزالة كلاسات الوضع والخطوط السابقة
    document.body.classList.remove('light-body', 'dark-body', 'inter', 'cairo', 'lato', 'roboto');

    // إضافة كلاس حسب الوضع
    document.body.classList.add(darkMode ? 'dark-body' : 'light-body');

    // ضبط اتجاه الصفحة حسب اللغة
    document.body.setAttribute("dir", i18n.language === 'ar' ? 'rtl' : 'ltr');

    // إضافة كلاس الخط
    document.body.classList.add(font);
  }, [darkMode, i18n.language, font]);

  return (
    <div className="app-container">
      <Router>
        <Navbar setFont={setFont} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
