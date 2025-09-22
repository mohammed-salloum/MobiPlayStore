import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import i18n from "../i18n/i18n";

const AXIOS_TIMEOUT = 30000;
const AXIOS_RETRIES = 2;

// =========================
// truncate خفيف وسريع
export const truncateWords = (text, wordLimit = 50) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

// =========================
// حساب السعر بعد الخصم
export const calculateDiscountedPrice = (price, discount) => {
  if (!price) return 0;
  return discount ? +(price * (1 - discount / 100)).toFixed(2) : price;
};

// =========================
// تحويل السعر إلى صيغة الدولار
export const formatUSD = (amount) => {
  if (typeof amount !== "number") return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

// =========================
// map بيانات الألعاب مع دعم RTL واللغة العربية من الباك
export const mapGamesData = (results, lang) =>
  results.map((game) => {
    const price = Number(game.price) || 0;
    const discount = Number(game.discount) || 0;
    const discountedPrice = game.discountedPrice !== undefined
      ? Number(game.discountedPrice)
      : calculateDiscountedPrice(price, discount);

    // نستخدم الوصف العربي إذا موجود في الباك
    const description = lang === "ar" && game.description_ar
      ? game.description_ar
      : game.description || "";

    return {
      id: game.id,
      name: game.name,
      img: game.background_image || "",
      price,
      discount,
      discountedPrice,
      discountedPriceFormatted: formatUSD(discountedPrice),
      rating: Number(game.rating) || 0,
      ratingCount: Number(game.ratings_count ?? game.reviews_count ?? 0),
      description: truncateWords(description, 50),
      rtl: lang === "ar",
      isTranslated: lang !== "ar" || !!description,
    };
  });

// =========================
// Axios fetch مع retry و delay
const axiosGet = async (url, params = {}) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  for (let i = 0; i <= AXIOS_RETRIES; i++) {
    try {
      const res = await axios.get(url, { params, timeout: AXIOS_TIMEOUT });
      return res.data;
    } catch (err) {
      if (i === AXIOS_RETRIES) throw err;
      await delay(300);
    }
  }
};

// =========================
// Fetchers
const fetchGamesAPI = async (url, lang) => {
  const data = await axiosGet(url, { lang });
  return mapGamesData(data.results, lang);
};

const fetchProductAPI = async (id, lang) => {
  const data = await axiosGet(`/api/games/${id}`, { lang });
  if (!data) return null;
  return mapGamesData([data], lang)[0];
};

// =========================
// React Query Hooks مع تحسين cache و prefetch
export const useProducts = () => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["products", lang],
    queryFn: ({ queryKey }) => fetchGamesAPI("/api/games/products", queryKey[1]),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useOffers = () => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["offers", lang],
    queryFn: ({ queryKey }) => fetchGamesAPI("/api/games/offers", queryKey[1]),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useProductById = (id) => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["product", id, lang],
    queryFn: ({ queryKey }) => fetchProductAPI(id, queryKey[2]),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// =========================
// Prefetch ذكي للسرعة القصوى
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const lang = i18n.language || "en";
    queryClient.prefetchQuery(["products", lang], () => fetchGamesAPI("/api/games/products", lang), {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
    });
    queryClient.prefetchQuery(["offers", lang], () => fetchGamesAPI("/api/games/offers", lang), {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
    });
  }, [queryClient]);
};

// =========================
// تحديث عند تغيير اللغة بدقة أكبر
export const useReloadOnLanguageChange = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const handleLanguageChange = () => {
      // invalidate كل المنتجات والعروض
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });

      // invalidate لكل المنتجات الفردية
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === "product" });
    };
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [queryClient]);
};
