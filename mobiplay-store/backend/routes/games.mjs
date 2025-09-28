import express from "express";
import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";
import { translateText } from "../utils/translate.js";

const router = express.Router();

// ===== RAWG API Key setup =====
// Ensure the RAWG API key is available in environment variables
const RAWG_API_KEY = process.env.RAWG_API_KEY;
if (!RAWG_API_KEY) {
  console.error("❌ RAWG_API_KEY is missing in .env!");
  process.exit(1);
}

// ===== Constants =====
const AXIOS_TIMEOUT = 30000; // 30 seconds timeout for external API requests

// ===== Utility Functions =====

// Generates a fixed price for a product based on its ID
const getFixedPrice = (id) => 10 + (parseInt(id, 10) % 51);

// Truncate a text to a maximum number of words for preview purposes
const truncateWords = (text, wordLimit = 50) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

// ===== Fetch RAWG Games =====
// Fetch multiple pages of games from RAWG API
const fetchRawgGames = async (pages = [1], pageSize = 8) => {
  const requests = pages.map((page) =>
    axios.get("https://api.rawg.io/api/games", {
      params: { key: RAWG_API_KEY, page_size: pageSize, page },
      timeout: AXIOS_TIMEOUT,
    })
  );
  const results = await Promise.all(requests);
  return results.flatMap((r) => r.data.results);
};

// ===== Cache Helper =====
// Try to retrieve data from cache, otherwise fetch and cache it
const getOrFetch = async (cacheKey, fetchFn, ttl = 86400, logFn = console.log) => {
  const cached = getCache(cacheKey);
  if (cached) {
    logFn(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }
  const data = await fetchFn();
  setCache(cacheKey, data, ttl);
  logFn(`[CACHE SET] ${cacheKey}`);
  return data;
};

// ===== Routes =====

// Root route
router.get("/", (req, res) => res.json({ message: "Welcome to Games API" }));

// Fetch products (games) with caching
router.get("/products", async (req, res) => {
  try {
    const data = await getOrFetch("products:fast", async () => {
      const rawGames = await fetchRawgGames([1,2,3,4]);
      const results = rawGames.map((game) => ({
        id: game.id,
        name: game.name || "Unknown",
        background_image: game.background_image,
        rating: game.rating ?? 0,
        ratings_count: game.ratings_count ?? 0,
        price: getFixedPrice(game.id),
      }));
      return { results, count: results.length };
    });
    // Set client-side cache header for 1 hour
    res.set("Cache-Control", "public, max-age=3600");
    res.json(data);
  } catch (err) {
    res.status(500).json({ results: [], error: "Failed to fetch products" });
  }
});


// Fetch special offers with discounts
router.get("/offers", async (req, res) => {
  try {
    const data = await getOrFetch("offers:fast", async () => {
      const rawGames = await fetchRawgGames([5,6]);
      const results = rawGames.map((game) => ({
        id: game.id,
        name: game.name || "Unknown",
        background_image: game.background_image,
        rating: game.rating ?? 0,
        ratings_count: game.ratings_count ?? 0,
        price: getFixedPrice(game.id),
        discount: 20,
        discountedPrice: getFixedPrice(game.id) * 0.8,
      }));
      return { results, count: results.length };
    });
    res.set("Cache-Control", "public, max-age=3600");
    res.json(data);
  } catch (err) {
    res.status(500).json({ results: [], error: "Failed to fetch offers" });
  }
});

// Fetch single product by ID with optional translation
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en"; // Default language is English
  const cacheKey = `product:${id}`;

  try {
    let product = getCache(cacheKey);

    // Fetch from RAWG API if not cached
    if (!product) {
      const rawGame = await axios
        .get(`https://api.rawg.io/api/games/${id}`, { params: { key: RAWG_API_KEY }, timeout: AXIOS_TIMEOUT })
        .then(r => r.data);
      if (!rawGame) return res.status(404).json({ error: "Product not found" });

      // Check if product has a discount in offers cache
      const offersCache = getCache("offers:fast");
      let discount = 0;
      if (offersCache && offersCache.results.some(g => g.id === rawGame.id))
        discount = offersCache.results.find(g => g.id === rawGame.id).discount || 0;

      product = {
        id: rawGame.id,
        name: rawGame.name,
        background_image: rawGame.background_image,
        rating: rawGame.rating ?? 0,
        ratings_count: rawGame.ratings_count ?? 0,
        price: getFixedPrice(id),
        discount,
        discountedPrice: getFixedPrice(id) * (1 - discount/100),
        description_raw: rawGame.description_raw || "",
      };
      setCache(cacheKey, product, 86400); // Cache product for 1 day
    }

    // Translate description if needed
    const descCacheKey = `desc:${id}:${lang}`;
    let description = getCache(descCacheKey);
    if (!description) {
      description = await translateText(product.description_raw, lang);
      setCache(descCacheKey, description, 86400);
    }

    res.json({ ...product, description: truncateWords(description, 50) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ===== Preload data at server start =====
export const preloadData = async (logFn = console.log) => {
  await getOrFetch("products:fast", async () => {
    const rawGames = await fetchRawgGames([1,2,3,4]);
    return { results: rawGames.map(g => ({
      id: g.id,
      name: g.name || "Unknown",
      background_image: g.background_image,
      rating: g.rating ?? 0,
      ratings_count: g.ratings_count ?? 0,
      price: getFixedPrice(g.id),
    })), count: rawGames.length };
  }, 43200, logFn); // Cache for 12 hours

  await getOrFetch("offers:fast", async () => {
    const rawGames = await fetchRawgGames([5,6]);
    return { results: rawGames.map(g => ({
      id: g.id,
      name: g.name || "Unknown",
      background_image: g.background_image,
      rating: g.rating ?? 0,
      ratings_count: g.ratings_count ?? 0,
      price: getFixedPrice(g.id),
      discount: 20,
      discountedPrice: getFixedPrice(g.id) * 0.8,
    })), count: rawGames.length };
  }, 43200, logFn);
};

export default router;
