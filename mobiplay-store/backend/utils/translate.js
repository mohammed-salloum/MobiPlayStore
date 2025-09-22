import translate from "@vitalets/google-translate-api";

export const translateText = async (text, targetLang = "en") => {
  if (!text) return "";
  if (targetLang === "en") return text; // لا حاجة للترجمة للإنجليزية

  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return text; // fallback للنص الأصلي
  }
};
