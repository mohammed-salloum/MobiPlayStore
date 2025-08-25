import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // أيقونات النجوم
import "./RatingStars.css"; // CSS الخاص بتنسيق النجوم

// 🔹 كومبوننت عرض وتقييم النجوم
function RatingStars({ userRating = 0, onRate, allowRate = true, darkMode = false }) {
  const [hovered, setHovered] = useState(0); // النجمة التي يمر عليها الماوس
  const [currentRating, setCurrentRating] = useState(userRating); // التقييم الحالي

  // 🔹 تحديث التقييم الحالي عند تغير prop userRating
  useEffect(() => {
    setCurrentRating(userRating);
  }, [userRating]);

  const stars = [1, 2, 3, 4, 5]; // مصفوفة تمثل النجوم الخمسة
  const ratingToShow = hovered || currentRating; // إذا كان المستخدم يحوم بالماوس، نظهر hovered، وإلا نظهر التقييم الحالي

  // 🔹 دالة التعامل مع الضغط على النجمة
  const handleClick = (star) => {
    if (!allowRate || currentRating !== 0) return; // يسمح بالتصويت مرة واحدة فقط إذا allowRate true
    setCurrentRating(star); // تحديث التقييم
    if (onRate) onRate(star); // استدعاء callback لتخزين التقييم خارجيًا
  };

  return (
    <div className={`stars-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      {stars.map((star) => {
        let fill = "empty"; // الوضع الافتراضي للنجمة
        if (ratingToShow >= star) fill = "full"; // نجمة ممتلئة
        else if (ratingToShow >= star - 0.5) fill = "half"; // نصف نجمة

        return (
          <span
            key={star}
            className="star-wrapper"
            onMouseEnter={() => allowRate && currentRating === 0 && setHovered(star)} // عند المرور بالماوس
            onMouseLeave={() => allowRate && setHovered(0)} // عند مغادرة الماوس
            onClick={() => handleClick(star)} // عند الضغط
            style={{ cursor: allowRate && currentRating === 0 ? "pointer" : "default" }} // تغيير شكل المؤشر
          >
            {fill === "full" && <FaStar className="rating-star filled" />}       {/* نجمة كاملة */}
            {fill === "half" && <FaStarHalfAlt className="rating-star filled" />} {/* نصف نجمة */}
            {fill === "empty" && <FaRegStar className="rating-star" />}          {/* نجمة فارغة */}
          </span>
        );
      })}
    </div>
  );
}

export default RatingStars
