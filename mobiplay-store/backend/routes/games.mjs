import express from "express";
import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";
import { translateText } from "../utils/translate.js";

const router = express.Router();

// ===== RAWG API Key =====
const RAWG_API_KEY = process.env.RAWG_API_KEY;
if (!RAWG_API_KEY) {
  console.error("❌ RAWG_API_KEY is missing in .env!");
  process.exit(1);
}

// ===== Constants =====
const AXIOS_TIMEOUT = 30000;
const DEFAULT_PAGE_SIZE = 8;
const CACHE_TTL = 300; // 5 دقائق
const TOTAL_PRODUCT_PAGES = 4;
const TOTAL_OFFER_PAGES = 2;
const OFFER_DISCOUNT = 20;

// ===== Utility Functions =====
const getFixedPrice = (id) => 10 + (parseInt(id, 10) % 51);

const truncateWords = (text, wordLimit = 50) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

// ===== Fetch RAWG API =====
const fetchRawgGamesPage = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const { data } = await axios.get("https://api.rawg.io/api/games", {
    params: { key: RAWG_API_KEY, page_size: pageSize, page },
    timeout: AXIOS_TIMEOUT,
  });
  return data.results;
};

// ===== Cache Helper (Lazy) =====
const getOrFetch = async (cacheKey, fetchFn, ttl = CACHE_TTL) => {
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = await fetchFn();
  setCache(cacheKey, data, ttl);
  return data;
};

// ===== Routes =====
router.get("/", (req, res) => res.json({ message: "Welcome to Games API" }));

// ===== Products =====
router.get("/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    if (page > TOTAL_PRODUCT_PAGES) {
      return res.status(400).json({ results: [], error: "Invalid page number" });
    }

    const cacheKey = `products:page:${page}:size:${DEFAULT_PAGE_SIZE}`;
    const results = await getOrFetch(cacheKey, () => fetchRawgGamesPage(page, DEFAULT_PAGE_SIZE));

    const games = results.map((game) => ({
      id: game.id,
      name: game.name || "Unknown",
      background_image: game.background_image,
      rating: game.rating ?? 0,
      ratings_count: game.ratings_count ?? 0,
      price: getFixedPrice(game.id),
    }));

    res.json({
      results: games,
      page,
      totalPages: TOTAL_PRODUCT_PAGES,
      totalCount: TOTAL_PRODUCT_PAGES * DEFAULT_PAGE_SIZE,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ results: [], error: "Failed to fetch products" });
  }
});

// ===== Offers =====
router.get("/offers", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    if (page > TOTAL_OFFER_PAGES) {
      return res.status(400).json({ results: [], error: "Invalid page number" });
    }

    // حساب رقم الصفحة في RAWG بعد آخر صفحة من المنتجات
    const rawgPage = TOTAL_PRODUCT_PAGES + page;
    const cacheKey = `offers:page:${page}:size:${DEFAULT_PAGE_SIZE}`;
    const results = await getOrFetch(cacheKey, () => fetchRawgGamesPage(rawgPage, DEFAULT_PAGE_SIZE));

    // إنشاء كاش مركزي لكل العروض (id -> خصم)
    let offersIndex = getCache("offersIndex") || {};
    results.forEach((game) => {
      offersIndex[game.id] = OFFER_DISCOUNT;
    });
    setCache("offersIndex", offersIndex, CACHE_TTL);

    const games = results.map((game) => ({
      id: game.id,
      name: game.name || "Unknown",
      background_image: game.background_image,
      rating: game.rating ?? 0,
      ratings_count: game.ratings_count ?? 0,
      price: getFixedPrice(game.id),
      discount: OFFER_DISCOUNT,
      discountedPrice: +(getFixedPrice(game.id) * (1 - OFFER_DISCOUNT / 100)).toFixed(2),
    }));

    res.json({
      results: games,
      page,
      totalPages: TOTAL_OFFER_PAGES,
      totalCount: TOTAL_OFFER_PAGES * DEFAULT_PAGE_SIZE,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ results: [], error: "Failed to fetch offers" });
  }
});

// ===== Single Product Details =====
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en";
    const cacheKey = `product:${id}`;

    const product = await getOrFetch(cacheKey, async () => {
      const { data: rawGame } = await axios.get(`https://api.rawg.io/api/games/${id}`, {
        params: { key: RAWG_API_KEY },
        timeout: AXIOS_TIMEOUT,
      });

      if (!rawGame) return null;

      // ===== استخدام كاش مركزي للعروض =====
      const offersIndex = getCache("offersIndex") || {};
      const discount = offersIndex[rawGame.id] || 0;

      return {
        id: rawGame.id,
        name: rawGame.name,
        background_image: rawGame.background_image,
        rating: rawGame.rating ?? 0,
        ratings_count: rawGame.ratings_count ?? 0,
        price: getFixedPrice(id),
        discount,
        discountedPrice: +(getFixedPrice(id) * (1 - discount / 100)).toFixed(2),
        description_raw: rawGame.description_raw || "",
      };
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    // ===== ترجمة عند الطلب =====
    const descCacheKey = `desc:${id}:${lang}`;
    let description = getCache(descCacheKey);
    if (!description) {
      description = await translateText(product.description_raw, lang);
      setCache(descCacheKey, description, 86400); // يوم كامل
    }

    res.json({ ...product, description: truncateWords(description, 50) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
