import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import Button from '../common/Button/Button';
import CustomSelect from '../common/Select/CustomSelect';
import PaymentConfirmation from './PaymentConfirmation';
import { useCart } from "../../context/CartContext";
import './PaymentForm.css';

const paymentOptions = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
];

function PaymentForm() {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { cartItems, totalPrice, cartItems: cart } = useCart(); // من CartContext
  const { clearCart, updateQuantity } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: paymentOptions[0],
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const savedForm = localStorage.getItem("paymentForm");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      const method = paymentOptions.find(opt => opt.value === parsed.paymentMethod.value) || paymentOptions[0];
      setFormData({ ...parsed, paymentMethod: method });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("paymentForm", JSON.stringify(formData));
  }, [formData]);

  const handleChangeInput = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleChangePayment = selectedOption =>
    setFormData(prev => ({ ...prev, paymentMethod: selectedOption }));

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      showMessage(t("checkout.fillAllFields"), "error");
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(true);
    }, 1000);
  };

  const handleConfirmPayment = () => {
    cart.forEach(item => updateQuantity(item.id, 1)); // إعادة تعيين الكميات إذا لزم
    clearCart(); // مسح السلة
    localStorage.removeItem("paymentForm");
    navigate(`/${language}/`);
  };

  if (showConfirmation) {
    return (
      <PaymentConfirmation
        cartItems={cartItems}
        total={totalPrice}
        onFinish={handleConfirmPayment}
        isRTL={isRTL}
      />
    );
  }

  return (
    <div className={`payment-form-wrapper ${theme} ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`payment-form-card theme-${theme}`}>
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
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="form-label">{t("checkout.paymentMethod")}</label>
            <CustomSelect
              options={paymentOptions.map(option => ({
                value: option.value,
                label: t(`checkout.paymentOptions.${option.value}`)
              }))}
              value={{
                value: formData.paymentMethod.value,
                label: t(`checkout.paymentOptions.${formData.paymentMethod.value}`)
              }}
              onChange={handleChangePayment}
              isSearchable={false}
            />
          </div>

          <div className="payment-buttons">
            <Button type="submit" variant="checkout" fullWidth disabled={loading}>
              {loading ? t("checkout.processing") : <><FaCheckCircle className="me-2" />{t("checkout.confirmPayment")}</>}
            </Button>
            <Button type="button" variant="back" fullWidth onClick={() => navigate(`/${language}/cart`)} disabled={loading}>
              ← {t("checkout.backToCart")}
            </Button>
          </div>
        </form>
      </div>

      <div className={`form-message ${message.type} theme-${theme} ${message.text ? "show" : ""}`}>
        {message.text || "\u00A0"}
      </div>
    </div>
  );
}

export default PaymentForm;
