import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useProductById, calculateDiscountedPrice } from "../../services/api";
import { calculateLocalRating } from "../../services/calculateLocalRating";
import ProductImageSection from "../../components/ProductDetails/ProductImageSection";
import ProductInfoSection from "../../components/ProductDetails/ProductInfoSection";
import "./ProductDetails.css";

function ProductDetails() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { data: product, isLoading } = useProductById(productId);

  const [quantity, setQuantity] = useState(1);

  // تحديث الكمية إذا كان المنتج موجود بالسلة
  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === productId);
    if (cartItem) setQuantity(cartItem.quantity);
  }, [cartItems, productId]);

  if (isNaN(productId)) {
    return (
      <div className={`product-error theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        {t("productDetails.invalidId")}
      </div>
    );
  }

  if (isLoading)
    return (
      <div className={`spinner-wrapper theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <Spinner text={isRTL ? "جاري التحميل..." : "Loading..."} />
      </div>
    );

  if (!product)
    return (
      <div className={`product-error theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        {t("productDetails.notFound")}
      </div>
    );

  const qty = Number(quantity) || 1;
  const discountedPrice =
    product.discountedPrice ?? calculateDiscountedPrice(product.price, product.discount ?? 0);
  const cartItem = cartItems.find((item) => item.id === productId);

  // حساب التقييم المحلي
  const { ratingValue, reviewCount } = calculateLocalRating(
    product.rating ?? 0,
    product.ratingCount ?? 0,
    productId
  );

  return (
    <div className={`product-details-page theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      {/* عرض صورة المنتج والتقييم */}
      <ProductImageSection
        product={product}
        avgRating={ratingValue}
        ratingCount={reviewCount}
        onRate={(value) => {
          if (!isNaN(value) && value >= 0 && value <= 5) {
            localStorage.setItem(`rating_${productId}`, value);
          }
        }}
        theme={theme}
        isRTL={isRTL}
      />

      {/* عرض تفاصيل المنتج والكمية وأزرار السلة + زر العودة */}
      <ProductInfoSection
        product={product}
        quantity={qty}
        setQuantity={setQuantity}
        cartItem={cartItem}
        onAddToCart={() => addToCart(product, qty)}
        onRemoveFromCart={() => removeFromCart(productId)}
        onBack={() => navigate(-1)}
        theme={theme}
        isRTL={isRTL}
      />
    </div>
  );
}

export default ProductDetails;
