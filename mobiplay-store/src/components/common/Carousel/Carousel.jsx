import React, { useRef, useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({ children, slidesToShowDefault = 4, rtl = false }) => {
  const carouselRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(slidesToShowDefault);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalPages =
    slidesToShow < children.length
      ? Math.ceil(children.length / slidesToShow)
      : 1;

  // ضبط عدد الشرائح حسب الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1025) setSlidesToShow(4);
      else if (window.innerWidth >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
      setCurrentPage(0);
      setDirection(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // الانتقال التلقائي
  useEffect(() => {
    if (slidesToShow >= children.length || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        let next = prev + direction;
        if (next >= totalPages - 1) setDirection(-1);
        if (next <= 0) setDirection(1);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, slidesToShow, totalPages]);

  const handleDotClick = (index) => {
    setCurrentPage(index);
    if (index === 0) setDirection(1);
    else if (index === totalPages - 1) setDirection(-1);
  };

  const getTranslateX = () => {
    if (!carouselRef.current) return 0;
    const card = carouselRef.current.querySelector(".feature-card");
    if (!card) return 0;

    const gap = parseFloat(window.getComputedStyle(carouselRef.current).gap) || 0;
    const cardWidth = card.offsetWidth + gap;
    const totalWidth = (children.length - slidesToShow) * cardWidth;
    const translate = currentPage * slidesToShow * cardWidth;

    return Math.min(translate, totalWidth);
  };

  return (
    <div className="features-carousel-wrapper">
      <div
        className={`features-carousel ${rtl ? "rtl-mode" : ""}`}
        ref={carouselRef}
        style={{
          transform: rtl
            ? `translateX(${getTranslateX()}px)`
            : `translateX(-${getTranslateX()}px)`,
        }}
      >
        {children}
      </div>

      {slidesToShow < children.length && totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentPage ? "active" : ""}`}
              onClick={() => handleDotClick(i)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
