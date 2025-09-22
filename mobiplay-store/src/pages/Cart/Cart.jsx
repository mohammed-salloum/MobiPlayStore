// src/pages/Cart/Cart.jsx
import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

import CartItem from "../../components/Cart/CartItem";
import CartSummary from "../../components/Cart/CartSummary";
import Button from "../../components/common/Button/Button";
import CartIcon from "../../components/CartIcon/CartIcon";

import "./Cart.css";

function Cart() {
  const { cartItems } = useCart();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const totalPrice = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems
      .reduce(
        (sum, item) =>
          sum + (item.discountedPrice ?? item.price ?? 0) * (item.quantity ?? 0),
        0
      )
      .toFixed(2);
  }, [cartItems]);

  // حالة السلة فارغة
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`cart-empty theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="empty-cart-icon">
          <CartIcon size="xlarge" wrapper="div" />
        </div>
        <h4 className="empty-message">{t("cart.emptyMessage")}</h4>
        <Button
          to={`/${i18n.language}/products`}
          variant="continue"
          theme={theme}
          aria-label={t("cart.continueShopping")}
        >
          ← {t("cart.continueShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className={`cart-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="cart-title">
        <CartIcon size="medium" wrapper="div" /> {t("cart.title")}
      </h2>

      <div className="cart-main">
        {/* قسم العناصر مع سكروول */}
        <div className="cart-left">
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} isRTL={isRTL} theme={theme} />
            ))}
          </ul>
        </div>

        {/* قسم الملخص ثابت */}
        <div className="cart-right">
          <CartSummary total={totalPrice} theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
