// src/pages/Products/Products.jsx
import React from "react";
import GenericProductPage from "../../components/Common/GenericProductPage/GenericProductPage";
import { useProducts } from "../../services/api";

const Products = () => (
  <GenericProductPage
    useDataHook={useProducts}          // الـ hook اللي يجيب المنتجات
    titleKey="products.title"          // عنوان الصفحة
    emptyKey="products.noProducts"     // رسالة عدم وجود منتجات
    fetchErrorKey="products.fetchError"// رسالة الخطأ
  />
);

export default Products;
