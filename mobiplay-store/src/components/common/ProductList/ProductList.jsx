import React, { useState, Suspense, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import Spinner from "../Spinner/Spinner";
import Pagination from "../Pagination/Pagination";
import { useCart } from "../../../context/CartContext";
import { calculateLocalRating } from "../../../services/calculateLocalRating";
import "./ProductList.css";

const ProductCard = React.lazy(() => import("../ProductCard/ProductCard"));

const ProductList = ({ items = [], title = "", itemsPerPage = 8, isRTL = false }) => {
  const { theme } = useContext(ThemeContext);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = parseInt(params.get("page"), 10);
    return saved && saved > 0 ? saved : 1;
  });

  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(start, start + itemsPerPage);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    currentPage > 1 ? params.set("page", currentPage) : params.delete("page");
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [currentPage]);

  const isInCart = (productId) => cartItems.some((item) => item.id === productId);
  const getCartQuantity = (productId) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

  const handleToggleCart = (product) => {
    if (isInCart(product.id)) removeFromCart(product.id);
    else addToCart(product, 1);
  };

  if (!items || items.length === 0) {
    return (
      <div className={`no-items theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        {isRTL ? "لا توجد منتجات" : "No products available"}
      </div>
    );
  }

  return (
    <div className={`product-list-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {title && <h2 className="product-list-title">{title}</h2>}

      <Suspense fallback={<Spinner />}>
        <div className="product-list-grid">
          {paginatedItems.map((product) => {
            const { ratingValue, reviewCount } = calculateLocalRating(
              product.rating ?? 0,
              product.ratingCount ?? 0,
              product.id
            );

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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            lang={isRTL ? "ar" : "en"}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ProductList;
