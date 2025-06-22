import React, { useContext } from "react";
import products from "../data/productsData";
import { ThemeContext } from "../components/ThemeContext";
import { Link } from "react-router-dom";

function Offers() {
  const { darkMode } = useContext(ThemeContext);

  // تصفية المنتجات التي تحتوي على خصم
  const discountedProducts = products.filter(
    (product) => product.discount && product.discount > 0
  );

  return (
    <div
      className={`container mt-5 pb-5 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ minHeight: "75vh" }}
    >
      <h2 className="mb-4 text-center">Special Offers & Discounts</h2>

      {discountedProducts.length === 0 ? (
        <p className="text-center">No special offers available at the moment.</p>
      ) : (
        <div className="row">
          {discountedProducts.map((product) => {
            // حساب السعر بعد الخصم
            const discountedPrice = (
              product.price *
              (1 - product.discount / 100)
            ).toFixed(2);

            return (
              <div key={product.id} className="col-md-4 mb-4">
                <div
                  className={`card h-100 shadow-sm rounded ${
                    darkMode ? "text-light" : ""
                  }`}
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #1e1e2f 0%, #2a2a3d 100%)"
                      : "white",
                    boxShadow: darkMode
                      ? "0 4px 15px rgba(122, 89, 209, 0.5)"
                      : "0 4px 15px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                >
                  {/* صورة المنتج */}
                  <img
                    src={product.img}
                    alt={product.name}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    {/* اسم المنتج مع ضبط اللون حسب الثيم */}
                    <h5
                      className="card-title"
                      style={{ color: darkMode ? "#e0e0e0" : "#212529" }}
                    >
                      {product.name}
                    </h5>
                    {/* عرض السعر الأصلي والسعر بعد الخصم */}
                    <p className="mb-1">
                      <span
                        className="text-decoration-line-through me-2"
                        style={{ color: darkMode ? "#bbb" : "#6c757d" }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="fw-bold" style={{ color: "red" }}>
                        ${discountedPrice}
                      </span>
                    </p>
                    {/* نسبة الخصم */}
                    <p
                      className="mb-3 fw-semibold"
                      style={{
                        color: darkMode ? "#90ee90" : "green",
                      }}
                    >
                      Save {product.discount}%!
                    </p>
                    {/* زر للانتقال لتفاصيل المنتج */}
                    <Link
                      to={`/product/${product.id}`}
                      className={`btn mt-auto`}
                      style={{
                        backgroundColor: darkMode ? "#7a59d1" : "#0d6efd",
                        color: "white",
                        fontWeight: "600",
                        border: "none",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode
                          ? "#9c7ef4"
                          : "#084298";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode
                          ? "#7a59d1"
                          : "#0d6efd";
                      }}
                    >
                      View Details
                    </Link>
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
