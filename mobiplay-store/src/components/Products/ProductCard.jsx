// src/components/Products/ProductCard.jsx
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import RatingReadOnly from '../common/RatingReadOnly';
import Button from '../common/Button';
import './ProductCard.css';

function ProductCard({ product, averageRating, reviewCount, isInCart, isRTL }) {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div
      className={`product-card ${darkMode ? 'dark' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* صورة المنتج */}
      <img
        src={product.img}
        alt={product.name}
        className="product-image"
      />

      {/* اسم المنتج */}
      <h5 className="product-name">{product.name}</h5>

      {/* السعر */}
      <div className="product-price">
        {product.discount > 0 && (
          <span className="old-price">{product.price.toFixed(2)}$</span>
        )}
        <span className="new-price">
          {product.discount > 0
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price.toFixed(2)}$
        </span>
      </div>

      {/* النجوم والتقييم */}
      <RatingReadOnly
        rating={averageRating || product.rating}
        reviewCount={reviewCount || product.ratingCount}
        darkMode={darkMode}
        isRTL={isRTL}
      />

      {/* أزرار الإضافة والتفاصيل تحت بعض */}
      <div className={`cart-buttons ${isRTL ? 'rtl' : ''}`}>
        {!isInCart ? (
          <Button
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            variant="add-cart"
            dark={darkMode}
          >
            {t('products.addToCart')}
          </Button>
        ) : (
          <Button
            onClick={() => dispatch(removeFromCart(product.id))}
            variant="remove-cart"
            dark={darkMode}
          >
            {t('products.removeFromCart')}
          </Button>
        )}

        <Button
          to={`/product/${product.id}`}
          variant="details"
          dark={darkMode}
        >
          {t('products.details')}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
