// src/pages/Products/Products.jsx

import GenericProductPage from "../../components/Common/GenericProductPage/GenericProductPage";
import { useProducts } from "../../services/api";

/**
 * Products Page
 * --------------------------------------------------
 * Displays the list of available products using the
 * reusable GenericProductPage component.
 *
 * Product data is fetched via the `useProducts` hook.
 * All text content is resolved through i18n keys.
 */
const Products = () => (
  <GenericProductPage
    useDataHook={useProducts}           // Custom hook responsible for fetching products
    titleKey="products.title"           // Translation key for the page title
    emptyKey="products.noProducts"      // Translation key for empty products message
    fetchErrorKey="products.fetchError" // Translation key for fetch error message
  />
);

export default Products;
