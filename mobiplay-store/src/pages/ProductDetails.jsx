import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { rateProduct } from "../store/ratingSlice";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { ThemeContext } from "../context/ThemeContext";
import ProductInfoAndCart from "../components/ProductDetails/ProductInfoAndCart";
import ProductImageAndRating from "../components/ProductDetails/ProductImageAndRating";
import products from "../data/productsData";
import { useTranslation } from "react-i18next";
import "./ProductDetails.css";

function ProductDetails() {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const product = products.find(p => p.id === id);
  const cartItems = useSelector(state => state.cart.items);
  const cartItem = cartItems.find(item => item.id === id);
  const ratings = useSelector(state => state.rating);

  const [userRating, setUserRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  useEffect(() => {
    if (!product) return;
    const reduxUserRating = ratings.userRatings[id];
    if (reduxUserRating !== undefined) setUserRating(reduxUserRating);
    else {
      const savedLocalRating = localStorage.getItem(`rating_${id}`);
      setUserRating(savedLocalRating ? parseInt(savedLocalRating, 10) : 0);
    }
  }, [id, ratings.userRatings, product]);

  useEffect(() => {
    if (cartItem) setQuantity(cartItem.quantity);
    else setQuantity(1);
  }, [cartItem, id]);

  if (!product) {
    return (
      <div className={`content-wrapper ${darkMode ? "custom-bg-dark text-light" : "custom-bg-light text-dark"}`}>
        <button className={`btn btn-back ${darkMode ? "dark" : "light"}`} onClick={() => navigate(-1)}>
          ← {t("productDetails.back")}
        </button>
        <p>{t("productDetails.notFound")}</p>
      </div>
    );
  }

  const avgRating = ratings.ratingsData[id]?.avg || product.rating;
  const ratingCount = ratings.ratingsData[id]?.count ?? product.ratingCount;
  const totalPrice = (product.price * quantity).toFixed(2);

  const handleRate = (value) => {
    if (userRating !== 0) return;
    setUserRating(value);
    localStorage.setItem(`rating_${id}`, value);
    dispatch(rateProduct({ productId: product.id, rating: value }));
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const handleAddToCart = () => dispatch(addToCart({ ...product, quantity }));
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.id));
    setQuantity(1);
  };

  return (
    <div className="container mt-5">
      <div className={`content-wrapper ${darkMode ? "custom-bg-dark text-light" : "custom-bg-light text-dark"} ${isRTL ? "rtl" : "ltr"}`}>
        <button className={`btn btn-back mb-3 ${darkMode ? "dark" : "light"}`} onClick={() => navigate(-1)}>
          ← {t("productDetails.back")}
        </button>

        <div className="product-details-wrapper">
          {/* الصورة + التقييم */}
          <ProductImageAndRating
            product={product}
            avgRating={avgRating}
            ratingCount={ratingCount}
            userRating={userRating}
            onRate={handleRate}
            darkMode={darkMode}
            showThankYou={showThankYou}
            allowRate={userRating === 0}
            isRTL={isRTL}
          />

          {/* تفاصيل المنتج: الاسم + الوصف + السعر + كمية + أزرار */}
          <ProductInfoAndCart
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            totalPrice={totalPrice}
            darkMode={darkMode}
            cartItem={cartItem}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
