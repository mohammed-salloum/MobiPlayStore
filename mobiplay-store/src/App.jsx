import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Products from './components/pages/Products';
import ProductDetails from './components/pages/ProductDetails';
import Cart from './components/pages/Cart';
import ContactUs from './components/pages/ContactUs';
import AboutUs from './components/pages/AboutUs';
import Checkout from './components/pages/Checkout';
import Offers from './components/pages/Offers';
import FAQ from './components/pages/Faq';
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

  // ✅ حالة الخط المختار من localStorage أو الافتراضي
  const [font, setFont] = useState(localStorage.getItem('selectedFont') || "Arial, sans-serif");

  useEffect(() => {
    // إزالة كلاسات قديمة للوضع الداكن/الفاتح
    document.body.classList.remove('light-body', 'dark-body');

    // إضافة كلاس حسب الوضع
    document.body.classList.add(darkMode ? 'dark-body' : 'light-body');

    // ضبط اتجاه الصفحة حسب اللغة
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    // ✅ تطبيق الخط على كل الموقع
    document.body.style.fontFamily = font;
  }, [darkMode, i18n.language, font]);

  return (
    <div style={{ minHeight: '100vh' }} className={darkMode ? 'app-dark' : 'app-light'}>
      <Router>
        {/* ✅ تمرير setFont للـ Navbar ليتمكن FontSelector من تغيير الخط */}
        <Navbar setFont={setFont} />
        <main className="main-content" style={{ minHeight: 'calc(100vh - 140px)' }}>
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
