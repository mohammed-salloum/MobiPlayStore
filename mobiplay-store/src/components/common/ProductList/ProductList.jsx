import { Suspense, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext";
import Spinner from "../Spinner/Spinner";
import Pagination from "../Pagination/Pagination";
import { selectCartItems, addToCart, removeFromCart } from "../../../redux/slices/cartSlice";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

/**
 * ProductList Component
 * Displays a list of products with optional pagination and cart integration.
 *
 * Props:
 * - items: array of product objects
 * - title: optional section title
 * - totalPages: total number of pages (for server-side pagination)
 * - serverPagination: enable server-side pagination if true
 * - currentPage: current active page
 * - onPageChange: callback when page changes
 * - isRTL: boolean for right-to-left layout
 */
const ProductList = ({ 
  items = [], 
  title = "", 
  totalPages = 1, 
  serverPagination = false,
  currentPage = 1,
  onPageChange = () => {},
  isRTL = false
}) => {
  const { theme } = useContext(ThemeContext); // Get current theme
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems); // Get current cart items from Redux

  // Check if a product is in the cart
  const isInCart = (productId) => cartItems.some((item) => item.id === productId);

  // Get quantity of a product in the cart
  const getCartQuantity = (productId) => cartItems.find((item) => item.id === productId)?.quantity || 0;

  // Add or remove product from cart
  const handleToggleCart = (product) => {
    if (isInCart(product.id)) dispatch(removeFromCart(product.id));
    else dispatch(addToCart({ product, quantity: 1 }));
  };

  // Extract rating information for a product
  const getRatingInfo = (product) => ({
    ratingValue: product.rating ?? 0,
    reviewCount: product.ratingCount ?? 0
  });

  return (
    <div className={`product-list-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Section title */}
      {title && <h2 className="product-list-title">{title}</h2>}

      {/* Suspense fallback while loading product cards */}
      <Suspense fallback={<Spinner />}>
        <div className="product-list-grid">
          {items.map((product) => {
            const { ratingValue, reviewCount } = getRatingInfo(product);

            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  ratingInfo: { average: ratingValue, count: reviewCount }
                }}
                isRTL={isRTL}
                inCart={isInCart(product.id)}
                cartQuantity={getCartQuantity(product.id)}
                onToggleCart={() => handleToggleCart(product)}
              />
            );
          })}
        </div>

        {/* Pagination for server-side pagination */}
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