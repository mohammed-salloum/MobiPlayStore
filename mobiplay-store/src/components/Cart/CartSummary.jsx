// src/components/Cart/CartSummary.jsx
import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { clearCart, selectCartItems } from "../../redux/slices/cartSlice";
import Button from "../Common/Button/Button";
import "./CartSummary.css";

function CartSummary() {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const items = useSelector(selectCartItems);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCart());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`cart-summary theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="cart-total">
        <span>{t("cart.total")}:</span>
        <span className="cart-price">${totalPrice.toFixed(2)}</span>
      </div>

      <div className="cart-buttons">
        {/* زر الدفع */}
        <Button
          variant="checkout"
          theme={theme}
          fullWidth
          to={`/${i18n.language}/checkout`}
        >
          {t("cart.proceedToCheckout")}
        </Button>

        {/* زر مسح السلة */}
        <Button
          variant="clear-cart"
          theme={theme}
          fullWidth
          onClick={handleClearCart}
        >
          {t("cart.clearCart")}
        </Button>

        {/* زر متابعة التسوق */}
        <Button
          variant="continue"
          theme={theme}
          fullWidth
          to={`/${i18n.language}/products`}
        >
          ← {t("cart.continueShopping")}
        </Button>
      </div>
    </div>
  );
}

export default CartSummary;
