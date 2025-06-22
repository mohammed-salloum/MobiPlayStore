// App.js - المكون الرئيسي للتطبيق
// يحتوي على نظام التنقل بين الصفحات ويطبق ثيم الوضع الداكن أو الفاتح.

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import Checkout from './components/Checkout';
import Offers from './components/Offers';
import FAQ from './components/Faq';
import Reviews from './components/Reviews';
import './App.css';

import { ThemeContext } from './components/ThemeContext';

function App() {
  // الحصول على حالة الوضع الداكن من سياق الثيم
  const { darkMode } = useContext(ThemeContext);

  return (
    <div dir="ltr" className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
      <Router>
        {/* شريط التنقل يظهر في كل الصفحات */}
        <Navbar />
        <main className="main-content">
          <div className="min-vh-100">
            {/* تعريف مسارات التطبيق وربط كل مسار بمكونه */}
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
          </div>
        </main>
      </Router>
    </div>
  );
}

export default App;
