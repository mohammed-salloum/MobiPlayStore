import { useRef, useState, useEffect } from "react";
import "./Carousel.css";

/**
 * Carousel Component
 * - Displays items in a horizontal sliding carousel
 * - Supports responsive slides count
 * - Supports RTL / LTR movement
 * - Auto-slides with back-and-forth direction
 */
const Carousel = ({ children, slidesToShowDefault = 4, rtl = false }) => {
  // Reference to the carousel container (used for width calculations)
  const carouselRef = useRef(null);

  // Number of visible slides based on screen size
  const [slidesToShow, setSlidesToShow] = useState(slidesToShowDefault);

  // Current page index
  const [currentPage, setCurrentPage] = useState(0);

  // Sliding direction: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  /**
   * Total pages calculation
   * - If items fit in one view → only 1 page
   * - Otherwise → divide items by visible slides
   */
  const totalPages =
    slidesToShow < children.length
      ? Math.ceil(children.length / slidesToShow)
      : 1;

  /**
   * Handle responsive behavior
   * - Adjust number of slides based on screen width
   * - Reset page and direction on resize
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1025) setSlidesToShow(4);
      else if (window.innerWidth >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);

      setCurrentPage(0);
      setDirection(1);
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Auto sliding effect
   * - Slides every 3 seconds
   * - Changes direction at first and last page
   */
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

  /**
   * Handle dot navigation click
   * - Jump to selected page
   * - Adjust direction to keep smooth auto sliding
   */
  const handleDotClick = (index) => {
    setCurrentPage(index);

    if (index === 0) setDirection(1);
    else if (index === totalPages - 1) setDirection(-1);
  };

  /**
   * Calculate translateX value dynamically
   * - Uses first card width + gap
   * - Prevents overflow beyond last slide
   */
  const getTranslateX = () => {
    if (!carouselRef.current) return 0;

    const card = carouselRef.current.querySelector(".feature-card");
    if (!card) return 0;

    const gap =
      parseFloat(window.getComputedStyle(carouselRef.current).gap) || 0;

    const cardWidth = card.offsetWidth + gap;
    const totalWidth = (children.length - slidesToShow) * cardWidth;
    const translate = currentPage * slidesToShow * cardWidth;

    return Math.min(translate, totalWidth);
  };

  return (
    <div className="features-carousel-wrapper">
      {/* Carousel container */}
      <div
        className={`features-carousel ${rtl ? "rtl-mode" : ""}`}
        ref={carouselRef}
        /* Pass translateX to CSS using a custom property */
        style={{ "--translate-x": `${getTranslateX()}px` }}
      >
        {children}
      </div>

      {/* Navigation dots */}
      {slidesToShow < children.length && totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentPage ? "active" : ""}`}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
