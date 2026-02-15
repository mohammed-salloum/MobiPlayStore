import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Common/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from "../../redux/slices/cartSlice";
import {
  setRating,
  selectReviews,
} from "../../redux/slices/reviewsSlice";
import {
  useProductById,
  calculateDiscountedPrice,
} from "../../services/api";
import ProductImageSection from "../../components/ProductDetails/ProductImageSection";
import ProductInfoSection from "../../components/ProductDetails/ProductInfoSection";
import "./ProductDetails.css";

/**
 * ProductDetails Page
 * --------------------------------------------------
 * Displays full details for a single product including:
 * - Product images
 * - Pricing (with discount calculation)
 * - Ratings & reviews
 * - Cart interaction (add / remove)
 *
 * Handles loading, invalid ID, and not-found states.
 */
function ProductDetails() {
  // Theme and localization context
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Routing helpers
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const reviews = useSelector(selectReviews);

  // Fetch product data by ID
  const { data: product, isLoading } = useProductById(productId);

  // Local state for product quantity
  const [quantity, setQuantity] = useState(1);

  // --------------------------------------------------
  // Sync quantity with cart if product already exists
  // --------------------------------------------------
  useEffect(() => {
    const cartItem = cartItems.find(
      (item) => item.id === productId
    );
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItems, productId]);

  // --------------------------------------------------
  // Retry handler (reloads current page)
  // --------------------------------------------------
  const handleRetry = () => {
    navigate(0);
  };

  // --------------------------------------------------
  // Invalid product ID handling
  // --------------------------------------------------
  if (isNaN(productId)) {
    return (
      <div
        className={`product-error-wrapper theme-${theme} ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="product-error">
          <p>{t("productDetails.invalidId")}</p>
          <button onClick={handleRetry}>
            {t("productDetails.retry")}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div
        className={`spinner-wrapper theme-${theme} ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <Spinner
          text={isRTL ? "جاري التحميل..." : "Loading..."}
        />
      </div>
    );
  }

  // --------------------------------------------------
  // Product not found state
  // --------------------------------------------------
  if (!product) {
    return (
      <div
        className={`product-error-wrapper theme-${theme} ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="product-error">
          <p>{t("productDetails.notFound")}</p>
          <button onClick={handleRetry}>
            {t("productDetails.retry")}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Derived product & cart values
  // --------------------------------------------------
  const qty = Math.max(Number(quantity) || 1, 1);
  const finalPrice = calculateDiscountedPrice(
    product.price,
    product.discount ?? 0
  );
  const cartItem = cartItems.find(
    (item) => item.id === productId
  );

  // Ratings data (Redux + API)
  const userRating = reviews[productId] ?? 0;
  const avgRating = Number(product.rating ?? 0);
  const reviewCount = Number(product.ratingCount ?? 0);

  // --------------------------------------------------
  // Rating handler
  // --------------------------------------------------
  const handleRate = (value) => {
    if (!isNaN(value) && value >= 0 && value <= 5) {
      dispatch(
        setRating({ productId, rating: value })
      );
    }
  };

  // --------------------------------------------------
  // Cart actions
  // --------------------------------------------------
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(productId));
  };

  // --------------------------------------------------
  // Render page
  // --------------------------------------------------
  return (
    <div
      className={`product-details-page theme-${theme} ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
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