import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import RatingStars from "./RatingStars"; // مكون منفصل لعرض وتقييم النجوم
import products from "../data/productsData";
import { rateProduct } from "../store/ratingSlice";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { ThemeContext } from '../components/ThemeContext';

function ProductDetails() {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams(); // نجيب id من الرابط
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId); // المنتج المطلوب
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === productId);
  const ratings = useSelector((state) => state.rating);

  // حالة تقييم المستخدم
  const [userRating, setUserRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  // حالة كمية المنتج في السلة
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  // نمط الزر حسب الوضع الداكن
  const [btnStyle, setBtnStyle] = useState({
    backgroundColor: darkMode ? '#7a59d1' : '#0d6efd',
    color: darkMode ? '#f3f0ff' : 'white',
  });

  // عند تحميل المكون: نحدد تقييم المستخدم (من redux أو localStorage)
  useEffect(() => {
    if (!product) return;
    const reduxUserRating = ratings.userRatings[productId];
    if (reduxUserRating !== undefined) {
      setUserRating(reduxUserRating);
    } else {
      const savedLocalRating = localStorage.getItem(`rating_${productId}`);
      const initialUserRating = savedLocalRating ? parseInt(savedLocalRating, 10) : 0;
      setUserRating(initialUserRating);
    }
  }, [productId, ratings.userRatings, product]);

  // تحديث كمية المنتج في حالة تغيّر السلة أو المنتج
  useEffect(() => {
    if (cartItem) setQuantity(cartItem.quantity);
    else setQuantity(1);
  }, [productId, cartItem]);

  // إذا المنتج غير موجود (رابط خاطئ مثلاً)
  if (!product)
    return (
      <div className={`container mt-5 ${darkMode ? 'bg-dark text-light' : ''}`}>
        <button className="btn btn-back" onClick={() => navigate(-1)}>← Back</button>
        <p>Product not found</p>
      </div>
    );

  // تغييرات الكمية
  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // إضافة أو تحديث المنتج في السلة
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  // إزالة المنتج من السلة
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.id));
    setQuantity(1);
  };

  // تقييم المنتج
  const handleRate = (value) => {
    if (value === userRating) return;
    setUserRating(value);
    localStorage.setItem(`rating_${productId}`, value);
    dispatch(rateProduct({ productId: product.id, rating: value }));
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  // عرض النجوم (تقييم عام)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-warning" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      else stars.push(<FaRegStar key={i} className="text-warning" />);
    }
    return stars;
  };

  // حساب التقييم المتوسط من البيانات في redux أو المنتج الأصلي
  const getAverageRating = () => {
    const stored = ratings.ratingsData[productId];
    if (stored && stored.count > 0) {
      return parseFloat((stored.totalRating / stored.count).toFixed(1));
    }
    return product.rating || 0;
  };

  const avgRating = getAverageRating();
  const ratingCount = ratings.ratingsData[productId]?.count || product.ratingCount || 0;
  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <>
      <style>{`
        /* إزالة أسهم increment/decrement من input number */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield; /* Firefox */
        }

        .btn-back {
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-weight: 500;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          background-color: ${darkMode ? '#2c2c2c' : '#e2e6ea'};
          color: ${darkMode ? '#ccc' : '#555'};
          border-color: ${darkMode ? '#555' : '#ccc'};
        }
        .btn-back:hover {
          background-color: ${darkMode ? '#444' : '#d0d7de'};
          color: ${darkMode ? 'white' : 'black'};
        }
      `}</style>

      <div className={`container mt-5 ${darkMode ? 'bg-dark text-light' : ''}`}>
        <button className="btn btn-back mb-3" onClick={() => navigate(-1)}>← Back</button>

        <div className="d-flex gap-4 flex-wrap align-items-start">
          {/* صورة المنتج + التقييم */}
          <div style={{ flex: "1 1 300px", maxWidth: "500px" }}>
            <img src={product.img} alt={product.name} className="img-fluid rounded" />
            <div className={`mt-3 border-top pt-3 ${darkMode ? 'border-secondary' : ''}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  {renderStars(avgRating)}
                  <span className="fw-bold">{avgRating}</span>
                </div>
                <span className={darkMode ? 'text-light' : 'text-muted'}>
                  {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div className="mt-3">
                <span className={darkMode ? 'text-light' : ''}>Rate this product:</span>
                <RatingStars
                  currentRating={userRating}
                  onRate={handleRate}
                  darkMode={darkMode}
                />
              </div>

              {showThankYou && (
                <div className="alert alert-success mt-2 p-2 py-1" style={{ fontSize: "0.9rem" }}>
                  ✅ Thank you for your rating!
                </div>
              )}
            </div>
          </div>

          {/* تفاصيل المنتج، الكمية، السعر، أزرار الإضافة والإزالة */}
          <div style={{ flex: "1 1 400px" }}>
            <h2>{product.name}</h2>
            <p><strong>Game:</strong> {product.game}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description}</p>

            <div style={{ maxWidth: "150px", marginBottom: "10px" }}>
              <label className={darkMode ? 'text-light' : ''}>
                <strong>Quantity:</strong>
              </label>
              <div className="input-group">
                <button
                  className={`btn btn-outline-secondary ${darkMode ? 'btn-outline-light' : ''}`}
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className={`form-control text-center ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                  value={quantity}
                  min="1"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setQuantity(val);
                  }}
                />
                <button
                  className={`btn btn-outline-secondary ${darkMode ? 'btn-outline-light' : ''}`}
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <p className={darkMode ? 'text-light' : ''}>
              <strong>Total Price:</strong> ${totalPrice}
            </p>

            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn"
                style={{
                  ...btnStyle,
                  fontWeight: '600',
                  boxShadow: `0 2px 6px ${darkMode ? 'rgba(122, 89, 209, 0.5)' : 'rgba(13, 110, 253, 0.5)'}`,
                  transition: 'all 0.3s ease',
                }}
                onClick={handleAddToCart}
                onMouseEnter={(e) => {
                  setBtnStyle({
                    backgroundColor: darkMode ? '#9c7ef4' : '#0b5ed7',
                    color: '#fff',
                  });
                }}
                onMouseLeave={(e) => {
                  setBtnStyle({
                    backgroundColor: darkMode ? '#7a59d1' : '#0d6efd',
                    color: darkMode ? '#f3f0ff' : 'white',
                  });
                }}
              >
                {cartItem ? "Update Cart" : "Add to Cart"}
              </button>

              {cartItem && (
                <button className="btn btn-outline-danger" onClick={handleRemoveFromCart}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
