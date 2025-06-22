import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import products from '../data/productsData';  // استيراد كل المنتجات
import { ThemeContext } from './ThemeContext';
import ProductCard from './ProductCard';

function Products() {
  // جلب المنتجات في السلة
  const cartItems = useSelector((state) => state.cart.items);

  // جلب بيانات التقييمات
  const ratingData = useSelector((state) => state.rating.ratingsData);

  // حالة الثيم (الوضع الداكن أو الفاتح)
  const { darkMode } = useContext(ThemeContext);

  // دالة تفحص إذا المنتج في السلة
  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  // دالة حساب متوسط التقييم وعدد المراجعات
  const getRatingInfo = (product) => {
    const reduxRating = ratingData[product.id];
    const avg = reduxRating?.count
      ? reduxRating.totalRating / reduxRating.count
      : product.rating || 0;
    const count = reduxRating?.count || product.ratingCount || 0;

    return {
      average: parseFloat(avg.toFixed(1)),
      count,
    };
  };

  return (
    <div className={`container mt-5 ${darkMode ? 'text-light' : ''}`}>
      <h2 className="mb-4">Products</h2>
      <div className="row">
        {products.map((product) => {
          const { average, count } = getRatingInfo(product);
          return (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard
                product={product}
                averageRating={average}
                reviewCount={count}
                isInCart={isInCart(product.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
