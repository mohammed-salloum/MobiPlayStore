// src/pages/Products.jsx
import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import products from '../../data/productsData';
import { ThemeContext } from "../../context/ThemeContext";
import ProductCard from '../Products/ProductCard';
import RatingStars from '../common/RatingStars';
import { useTranslation } from 'react-i18next';
import './Products.css';

function Products() {
  const cartItems = useSelector((state) => state.cart.items);
  const ratingData = useSelector((state) => state.rating.ratingsData);
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  const productsWithRating = useMemo(() => {
    return products.map((product) => {
      const reduxRating = ratingData[product.id];
      const average = reduxRating?.count
        ? reduxRating.totalRating / reduxRating.count
        : product.rating || 0;
      const count = reduxRating?.count || product.ratingCount || 0;

      return {
        ...product,
        ratingInfo: {
          average: parseFloat(average.toFixed(1)),
          count,
        },
      };
    });
  }, [ratingData]);

  return (
    <div
      className={`products-container container mt-5 ${darkMode ? 'text-light' : ''}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="products-title mb-4">{t("products.title")}</h2>

      <div className="products-row row">
        {productsWithRating.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <ProductCard
              product={product}
              isInCart={isInCart(product.id)}
              isRTL={isRTL}
            >
              {/* النجوم للعرض فقط */}
              <div className="mb-2">
                <RatingStars
                  averageRating={product.ratingInfo.average}
                  userRating={0}        
                  allowRate={false}     
                  darkMode={darkMode}   
                  isRTL={isRTL}         
                />
              </div>

              <span className={`rating-count ${darkMode ? 'text-light' : ''}`}>
                ({product.ratingInfo.count} {product.ratingInfo.count !== 1 ? t('products.reviews') : t('products.review')})
              </span>

            </ProductCard>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
