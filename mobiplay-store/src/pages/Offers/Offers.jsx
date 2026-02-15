// src/pages/Offers/Offers.jsx
import React from "react";
import GenericProductPage from "../../components/Common/GenericProductPage/GenericProductPage";
import { useOffers } from "../../services/api";

/**
 * Offers Page
 * ------------------------------
 * This page displays discounted products (offers)
 * using a reusable GenericProductPage component.
 *
 * Data fetching is handled by the `useOffers` hook.
 * Text content is resolved via i18n translation keys.
 */
const Offers = () => (
  <GenericProductPage
    useDataHook={useOffers}          // Custom hook responsible for fetching offers data
    titleKey="offers.title"          // Translation key for the page title
    emptyKey="offers.empty"          // Translation key for empty state message
    fetchErrorKey="offers.fetchError"// Translation key for fetch error message
  />
);

export default Offers;
