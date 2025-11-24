import React, { Suspense, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import Spinner from "../Spinner/Spinner";
import Pagination from "../Pagination/Pagination";
import { selectCartItems, addToCart, removeFromCart } from "../../../redux/slices/cartSlice";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

const ProductList = ({ 
  items = [], 
  title = "", 
  totalPages = 1, 
  serverPagination = false,
  currentPage = 1,
  onPageChange = () => {},
  isRTL = false
}) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const isInCart = (productId) => cartItems.some((item) => item.id === productId);
  const getCartQuantity = (productId) => cartItems.find((item) => item.id === productId)?.quantity || 0;

  const handleToggleCart = (product) => {
    if (isInCart(product.id)) dispatch(removeFromCart(product.id));
    else dispatch(addToCart({ product, quantity: 1 }));
  };

  const getRatingInfo = (product) => ({
    ratingValue: product.rating ?? 0,
    reviewCount: product.ratingCount ?? 0
  });

  return (
    <div className={`product-list-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {title && <h2 className="product-list-title">{title}</h2>}

      <Suspense fallback={<Spinner />}>
        <div className="product-list-grid">
          {items.map((product) => {
            const { ratingValue, reviewCount } = getRatingInfo(product);
            return (
              <ProductCard
                key={product.id}
                product={{ ...product, ratingInfo: { average: ratingValue, count: reviewCount } }}
                isRTL={isRTL}
                inCart={isInCart(product.id)}
                cartQuantity={getCartQuantity(product.id)}
                onToggleCart={() => handleToggleCart(product)}
              />
            );
          })}
        </div>

        {serverPagination && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            lang={isRTL ? "ar" : "en"}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ProductList;