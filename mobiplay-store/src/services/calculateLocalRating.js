// ===== Calculate Local Rating =====
// This utility calculates a product's rating by combining:
//  - The original API rating and review count
//  - The locally stored user rating (if available in localStorage)
//
// This allows the app to reflect the user's rating instantly
// without requiring a backend update.

export function calculateLocalRating(baseRating, baseCount, productId) {
  // Validate productId - required for localStorage key
  if (productId === null || productId === undefined) {
    console.warn("calculateLocalRating: productId is required");
    return { ratingValue: 0, reviewCount: 0 };
  }

  // Ensure base rating is a valid number, fallback to 0
  const rating = typeof baseRating === "number" && !isNaN(baseRating) ? baseRating : 0;

  // Ensure base count is a non-negative number, fallback to 0
  const count = typeof baseCount === "number" && baseCount >= 0 ? baseCount : 0;

  // Retrieve user's stored rating from localStorage
  const storedRating = Number(localStorage.getItem(`rating_${productId}`)) || 0;
  const hasRated = storedRating > 0; // Check if the user has rated this product

  // If the user has rated, increase count by 1, otherwise keep original
  const reviewCount = hasRated ? count + 1 : count;

  // Calculate updated average rating:
  // - If rated → include storedRating in weighted average
  // - If not rated → just return original base rating
  const ratingValue = hasRated
    ? Number(((rating * count + storedRating) / reviewCount).toFixed(1))
    : Number(rating.toFixed(1));

  // Return updated rating value and review count
  return {
    ratingValue,
    reviewCount
  };
}
