// ProductCard.jsx - مكون بطاقة المنتج لعرض معلومات المنتج وتفاعلاته

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { ThemeContext } from './ThemeContext';

// دالة ترسم نجوم التقييم بناءً على قيمة التقييم (ممتلئ، نصف ممتلئ، فارغ)
const renderStars = (average) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (average >= i) {
      stars.push(<FaStar key={i} color="#FFA41C" style={{ marginRight: 2 }} />);
    } else if (average >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#FFA41C" style={{ marginRight: 2 }} />);
    } else {
      stars.push(<FaRegStar key={i} color="#FFA41C" style={{ marginRight: 2 }} />);
    }
  }
  return stars;
};

function ProductCard({ product, averageRating, reviewCount, isInCart }) {
  // تنفيذ أوامر تعديل السلة (الإضافة أو الإزالة)
  const dispatch = useDispatch();

  // قراءة حالة الوضع الداكن من سياق الثيم للتحكم بالمظهر
  const { darkMode } = useContext(ThemeContext);

  // أنماط الزر الرئيسي التي تتغير حسب حالة الثيم (داكن/فاتح)
  const btnPrimaryStyle = {
    backgroundColor: darkMode ? '#7a59d1' : '#0d6efd',
    color: darkMode ? '#f3f0ff' : 'white',
    fontWeight: '600',
    boxShadow: `0 2px 6px ${darkMode ? 'rgba(122, 89, 209, 0.5)' : 'rgba(13, 110, 253, 0.5)'}`,
    transition: 'all 0.3s ease',
  };

  return (
    <div
      className={`card p-3 h-100 shadow-sm rounded ${
        darkMode ? 'bg-dark text-light border-secondary' : ''
      }`}
    >
      {/* صورة المنتج */}
      <img
        src={product.img}
        alt={product.name}
        className="card-img-top mb-3"
        style={{ height: '220px', objectFit: 'cover', borderRadius: '6px' }}
      />

      {/* اسم المنتج */}
      <h5 className="fw-semibold">{product.name}</h5>

      {/* سعر المنتج */}
      <p className="fw-bold fs-5 text-primary">${product.price.toFixed(2)}</p>

      {/* عرض التقييم بالنجوم وعدد المراجعات */}
      <div className="d-flex align-items-center mt-2 mb-3" style={{ gap: '6px' }} aria-label={`Rated ${averageRating} out of 5 stars`}>
        <div>{renderStars(averageRating)}</div>
        <span
          className="fw-bold"
          style={{ fontSize: '0.9rem', color: darkMode ? '#ffc107' : '#6c757d' }}
        >
          {averageRating}
        </span>
        <span
          style={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#6c757d' }}
        >
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      </div>

      {/* أزرار الإضافة والإزالة من السلة */}
      <div className="d-grid gap-2">
        {!isInCart ? (
          <button
            className="btn"
            style={btnPrimaryStyle}
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#9c7ef4' : '#0b5ed7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#7a59d1' : '#0d6efd';
            }}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="btn btn-outline-danger fw-semibold"
            onClick={() => dispatch(removeFromCart(product.id))}
          >
            Remove from Cart
          </button>
        )}

        {/* رابط صفحة تفاصيل المنتج */}
        <Link
          to={`/product/${product.id}`}
          className="btn d-flex align-items-center justify-content-center gap-2"
          style={{
            border: `1px solid ${darkMode ? '#7a59d1' : '#0d6efd'}`,
            backgroundColor: 'transparent',
            color: darkMode ? '#7a59d1' : '#0d6efd',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#7a59d1' : '#0d6efd';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = darkMode ? '#7a59d1' : '#0d6efd';
          }}
        >
          <FaInfoCircle style={{ color: darkMode ? '#7a59d1' : undefined }} />
          Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
