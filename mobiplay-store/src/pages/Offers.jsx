// src/components/Home/Offers.jsx
import React, { useContext } from "react";
import products from "../data/productsData";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Button from "../components/common/Button"; // استيراد المكون العام
import "./Offers.css";

function Offers() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const discountedProducts = products.filter(
    (product) => product.discount && product.discount > 0
  );

  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`offers-container container mt-5 pb-5 ${darkMode ? "dark-mode" : "light-mode"} ${isRTL ? "rtl" : "ltr"}`}
    >
      <h2 className="mb-4 text-center">{t("offers.title")}</h2>

      {discountedProducts.length === 0 ? (
        <p className="text-center">{t("offers.noOffers")}</p>
      ) : (
        <div className="row">
          {discountedProducts.map((product) => {
            const discountedPrice = (
              product.price *
              (1 - product.discount / 100)
            ).toFixed(2);

            return (
              <div key={product.id} className="col-md-4 mb-4">
                <div className={`offer-card card h-100 shadow-sm rounded ${darkMode ? "dark-card" : "light-card"}`}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="card-img-top offer-img"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title offer-title">{product.name}</h5>
                    <p className="mb-1">
                      <span className="old-price">{product.price.toFixed(2)}$</span>
                      <span className="new-price">{discountedPrice}$</span>
                    </p>
                    <p className="mb-3 fw-semibold discount-text">
                      {t("offers.save")} {product.discount}%
                    </p>
                    {/* زر التفاصيل باستخدام مكون Button */}
                    <Button
                      to={`/product/${product.id}`}
                      variant="details"
                      dark={darkMode}
                      fullWidth={false} // الزر داخل الكارت، لا يحتاج كامل العرض
                      className="mt-auto"
                    >
                      {t("offers.viewDetails")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Offers;
