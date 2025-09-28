import translate from "@vitalets/google-translate-api";

// ===== Translation Utility =====
// Provides a helper function to translate text into a target language
// using the unofficial Google Translate API (@vitalets/google-translate-api).
// Includes fallback behavior and error handling for robustness.

export const translateText = async (text, targetLang = "en") => {
  // Return empty string if input is falsy (null, undefined, empty string).
  if (!text) return "";

  // Skip translation if the target language is English (optimization).
  if (targetLang === "en") return text;

  try {
    // Perform translation using the API.
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    // Log error and return original text as a safe fallback.
    console.error("❌ Translation error:", err.message);
    return text;
  }
};
