import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import i18n from "../i18n/i18n";

// ===== API base URL setup =====
const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api/games"
  : "https://mobiplaystore.onrender.com/api/games";

// ===== Axios config =====
const AXIOS_TIMEOUT = 30000;
const AXIOS_RETRIES = 2;

// ===== Utility Functions =====
export const truncateWords = (text, wordLimit = 50) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

export const calculateDiscountedPrice = (price, discount) => {
  if (!price) return 0;
  return discount ? +(price * (1 - discount / 100)).toFixed(2) : price;
};

export const formatUSD = (amount) => {
  if (typeof amount !== "number") return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

export const mapGamesData = (results, lang) =>
  results.map((game) => {
    const price = Number(game.price) || 0;
    const discount = Number(game.discount) || 0;
    const discountedPrice =
      game.discountedPrice !== undefined
        ? Number(game.discountedPrice)
        : calculateDiscountedPrice(price, discount);

    const description = game.description || "";

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

// ===== Axios GET with retry + duplicate prevention =====
const pendingRequests = new Map();

const axiosGet = async (url, params = {}) => {
  const key = `${url}?${new URLSearchParams(params).toString()}`;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = (async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    for (let i = 0; i <= AXIOS_RETRIES; i++) {
      try {
        const res = await axios.get(url, { params, timeout: AXIOS_TIMEOUT });
        return res.data;
      } catch (err) {
        if (i === AXIOS_RETRIES) throw err;
        await delay(300);
      }
    }
  })();

  pendingRequests.set(key, promise);
  const result = await promise;
  pendingRequests.delete(key);
  return result;
};

// ===== API Fetchers =====
const fetchGamesAPI = async (endpoint, lang, page = 1, pageSize = 8) => {
  const url = `${API_URL}${endpoint}`;
  const data = await axiosGet(url, { lang, page, pageSize });
  return {
    games: mapGamesData(data.results, lang),
    page: data.page,
    totalPages: data.totalPages,
    totalCount: data.totalCount,
  };
};

const fetchProductAPI = async (id, lang) => {
  const url = `${API_URL}/products/${id}`;
  const data = await axiosGet(url, { lang });
  if (!data) return null;
  return mapGamesData([data], lang)[0];
};

// ===== React Query Hooks =====
export const useProducts = (page = 1, pageSize = 8, enabled = true) => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["products", lang, page, pageSize],
    queryFn: () => fetchGamesAPI("/products", lang, page, pageSize),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useOffers = (page = 1, pageSize = 8, enabled = true) => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["offers", lang, page, pageSize],
    queryFn: () => fetchGamesAPI("/offers", lang, page, pageSize),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useProductById = (id, enabled = true) => {
  const lang = i18n.language || "en";
  return useQuery({
    queryKey: ["product", id, lang],
    queryFn: () => fetchProductAPI(id, lang),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 60,
    enabled: !!id && enabled,
    refetchOnWindowFocus: false,
  });
};

// ===== Reload cache on language change =====
export const useReloadOnLanguageChange = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const handleLanguageChange = () => {
      const lang = i18n.language || "en";
      queryClient.invalidateQueries({ queryKey: ["products", lang] });
      queryClient.invalidateQueries({ queryKey: ["offers", lang] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "product",
      });
    };
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [queryClient]);
};
