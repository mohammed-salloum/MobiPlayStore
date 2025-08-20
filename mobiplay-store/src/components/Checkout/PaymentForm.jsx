// src/components/payment/PaymentForm.jsx
import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Select from 'react-select';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Button from '../common/Button';
import './PaymentForm.css';

const paymentOptions = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
];

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: paymentOptions[0],
  });

  const [loading, setLoading] = useState(false);

  const handleChangeInput = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePayment = (selectedOption) => {
    setFormData(prev => ({ ...prev, paymentMethod: selectedOption }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(t("checkout.paymentSuccess"));
      dispatch(clearCart());
      navigate('/');
    }, 1500);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? '#2a2a3d' : '#fff',
      borderColor: state.isFocused
        ? (darkMode ? '#d4af37' : '#556b2f')
        : (darkMode ? '#555' : '#ced4da'),
      boxShadow: state.isFocused
        ? (darkMode ? '0 0 8px #d4af37' : '0 0 8px #556b2f')
        : 'none',
      borderRadius: 6,
      minHeight: '48px',
      color: darkMode ? '#eee' : '#000',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
    singleValue: (provided) => ({ ...provided, color: darkMode ? '#eee' : '#000' }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? '#2a2a3d' : '#f5f5dc',
      borderRadius: 6,
      marginTop: 4,
      boxShadow: darkMode
        ? '0 4px 10px rgba(212, 175, 55, 0.3)'
        : '0 4px 10px rgba(85, 107, 47, 0.3)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? (darkMode ? '#d4af37' : '#556b2f')
        : 'transparent',
      color: state.isFocused
        ? (darkMode ? '#000' : '#fff')
        : darkMode ? '#eee' : '#000',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: darkMode ? '#d4af37' : '#556b2f',
      transition: 'color 0.3s ease',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <div
      className={`payment-form-card ${darkMode ? 'dark-mode' : 'light-mode'}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h4 className="payment-form-title">{t("checkout.paymentDetails")}</h4>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="name" className="form-label">{t("checkout.fullName")}</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control form-control-lg"
              placeholder={t("checkout.fullNamePlaceholder")}
              value={formData.name}
              onChange={handleChangeInput}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">{t("checkout.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control form-control-lg"
              placeholder={t("checkout.emailPlaceholder")}
              value={formData.email}
              onChange={handleChangeInput}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">{t("checkout.shippingAddress")}</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            className="form-control form-control-lg"
            placeholder={t("checkout.addressPlaceholder")}
            value={formData.address}
            onChange={handleChangeInput}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentMethod" className="form-label">{t("checkout.paymentMethod")}</label>
          <Select
            options={paymentOptions.map(option => ({
              value: option.value,
              label: t(`checkout.paymentOptions.${option.value}`)
            }))}
            value={{
              value: formData.paymentMethod.value,
              label: t(`checkout.paymentOptions.${formData.paymentMethod.value}`)
            }}
            onChange={handleChangePayment}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>
        <div className="payment-buttons">
          {/* زر التأكيد */}
          <Button
            type="submit"
            variant="checkout"
            dark={darkMode}
            fullWidth
            disabled={loading}
          >
            {loading ? t("checkout.processing") : (
              <>
                <FaCheckCircle className="me-2" />
                {t("checkout.confirmPayment")}
              </>
            )}
          </Button>

          {/* زر العودة */}
          <Button
            type="button"
            variant="back"
            dark={darkMode}
            fullWidth
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            ← {t("checkout.backToCart")}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default PaymentForm;
