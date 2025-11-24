// src/pages/Cart/ProductDetails.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Common/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, selectCartItems } from "../../redux/slices/cartSlice";
import { setRating, selectReviews } from "../../redux/slices/reviewsSlice";
import { useProductById, calculateDiscountedPrice } from "../../services/api";
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
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const reviews = useSelector(selectReviews);

  const { data: product, isLoading } = useProductById(productId);
  const [quantity, setQuantity] = useState(1);

  // تحديث الكمية إذا كان المنتج موجود بالسلة
  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === productId);
    if (cartItem) setQuantity(cartItem.quantity);
  }, [cartItems, productId]);

  // دالة لإعادة المحاولة (مثلاً إعادة تحميل الصفحة أو fetch)
  const handleRetry = () => {
    navigate(0); // إعادة تحميل الصفحة الحالية
  };

  // رسالة خطأ للـ Invalid ID
  if (isNaN(productId)) {
    return (
      <div className={`product-error-wrapper theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="product-error">
          <p>{t("productDetails.invalidId")}</p>
          <button onClick={handleRetry}>{t("productDetails.retry")}</button>
        </div>
      </div>
    );
  }

  // عرض Spinner أثناء التحميل
  if (isLoading)
    return (
      <div className={`spinner-wrapper theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <Spinner text={isRTL ? "جاري التحميل..." : "Loading..."} />
      </div>
    );

  // رسالة خطأ إذا لم يُوجد المنتج
  if (!product)
    return (
      <div className={`product-error-wrapper theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="product-error">
          <p>{t("productDetails.notFound")}</p>
          <button onClick={handleRetry}>{t("productDetails.retry")}</button>
        </div>
      </div>
    );

  const qty = Math.max(Number(quantity) || 1, 1);
  const finalPrice = calculateDiscountedPrice(product.price, product.discount ?? 0);
  const cartItem = cartItems.find((item) => item.id === productId);

  // قراءة التقييمات من Redux
  const userRating = reviews[productId] ?? 0;
  const avgRating = Number(product.rating ?? 0);
  const reviewCount = Number(product.ratingCount ?? 0);

  const handleRate = (value) => {
    if (!isNaN(value) && value >= 0 && value <= 5) {
      dispatch(setRating({ productId, rating: value }));
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className={`product-details-page theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      <ProductImageSection
        product={product}
        avgRating={avgRating}
        ratingCount={reviewCount}
        userRating={userRating}
        onRate={handleRate}
        theme={theme}
        isRTL={isRTL}
      />

      <ProductInfoSection
        product={product}
        quantity={qty}
        setQuantity={setQuantity}
        cartItem={cartItem}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onBack={() => navigate(-1)}
        theme={theme}
        isRTL={isRTL}
        disableButtons={isLoading}
        finalPrice={finalPrice}
      />
    </div>
  );
}

export default ProductDetails;
