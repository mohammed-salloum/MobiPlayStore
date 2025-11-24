// src/pages/Offers/Offers.jsx
import React from "react";
import GenericProductPage from "../../components/Common/GenericProductPage/GenericProductPage";
import { useOffers } from "../../services/api";

const Offers = () => (
  <GenericProductPage
    useDataHook={useOffers}         // الـ hook اللي يجيب العروض
    titleKey="offers.title"         // عنوان الصفحة
    emptyKey="offers.empty"         // رسالة عدم وجود عروض
    fetchErrorKey="offers.fetchError" // رسالة الخطأ
  />
);

export default Offers;
