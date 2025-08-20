import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';                   // الكومبوننت الرئيسي للتطبيق
import { Provider } from 'react-redux';   // لتوفير الـ Redux Store لكل الكومبوننتات
import { store } from './store/store';    // المتجر المركزي (Redux Store)
import { ThemeProvider } from './context/ThemeContext'; // مزود السياق للثيم (الداكن/الفاتح)
import './index.css';  // القواعد العامة
import './App.css';    // التفاصيل الخاصة بالمكونات
import "./i18n/i18n"; // مهم جداً: استدعاء التهيئة


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);
