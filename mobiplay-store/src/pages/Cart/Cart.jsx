import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CartItem from "../../components/Cart/CartItem";
import CartSummary from "../../components/Cart/CartSummary";
import Button from "../../components/Common/Button/Button";
import CartIcon from "../../components/CartIcon/CartIcon";

import "./Cart.css";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
        <CartIcon size="medium" wrapper="div" showBadge={false} /> {t("cart.title")}
      </h2>

      <div className="cart-main">
        {/* العناصر */}
        <div className="cart-left">
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        </div>

        {/* الملخص */}
        <div className="cart-right">
          <CartSummary theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
