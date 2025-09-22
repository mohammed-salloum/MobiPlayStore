// src/services/calculateLocalRating.js

/**
 * حساب متوسط التقييم وعدد المراجعات مع التقييم المخزن محلياً
 * @param {number|null} baseRating - متوسط التقييم الأصلي للمنتج
 * @param {number|null} baseCount - عدد المراجعات الأصلي
 * @param {number|string} productId - معرف المنتج
 * @returns {{ ratingValue: number, reviewCount: number }}
 */
export function calculateLocalRating(baseRating, baseCount, productId) {
  if (productId === null || productId === undefined) {
    console.warn("calculateLocalRating: productId is required");
    return { ratingValue: 0, reviewCount: 0 };
  }

  const rating = typeof baseRating === "number" && !isNaN(baseRating) ? baseRating : 0;
  const count = typeof baseCount === "number" && baseCount >= 0 ? baseCount : 0;

  const storedRating = Number(localStorage.getItem(`rating_${productId}`)) || 0;
  const hasRated = storedRating > 0;

  const reviewCount = hasRated ? count + 1 : count;
  const ratingValue = hasRated
    ? Number(((rating * count + storedRating) / reviewCount).toFixed(1))
    : Number(rating.toFixed(1));

  return {
    ratingValue,
    reviewCount
  };
}
