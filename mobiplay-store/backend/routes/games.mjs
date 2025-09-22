import express from "express";
import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";
import { translateText } from "../utils/translate.js";

const router = express.Router();
const RAWG_API_KEY = process.env.RAWG_API_KEY;
if (!RAWG_API_KEY) {
  console.error("❌ RAWG_API_KEY is missing in .env!");
  process.exit(1);
}

const AXIOS_TIMEOUT = 30000;
const getFixedPrice = (id) => 10 + (parseInt(id, 10) % 51);

const truncateWords = (text, wordLimit = 50) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
};

const formatUSD = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

// ===== Fetch RAWG
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

// ===== Helper للكاش
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

// ===== Routes
router.get("/products", async (req, res) => {
  try {
    const data = await getOrFetch("products:fast", async () => {
      const rawGames = await fetchRawgGames([1, 2, 3, 4]);
      const results = rawGames.map((game) => {
        const price = getFixedPrice(game.id);
        return {
          id: game.id,
          name: game.name || "Unknown",
          background_image: game.background_image,
          rating: game.rating ?? 0,
          ratings_count: game.ratings_count ?? 0,
          price,
        };
      });
      return { results, count: results.length };
    });
    res.set("Cache-Control", "public, max-age=3600");
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ results: [], error: "Failed to fetch products" });
  }
});

router.get("/offers", async (req, res) => {
  try {
    const data = await getOrFetch("offers:fast", async () => {
      const rawGames = await fetchRawgGames([5, 6]);
      const results = rawGames.map((game) => {
        const price = getFixedPrice(game.id);
        const discount = 20;
        return {
          id: game.id,
          name: game.name || "Unknown",
          background_image: game.background_image,
          rating: game.rating ?? 0,
          ratings_count: game.ratings_count ?? 0,
          price,
          discount,
          discountedPrice: price * (1 - discount / 100),
        };
      });
      return { results, count: results.length };
    });
    res.set("Cache-Control", "public, max-age=3600");
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching offers:", err.message);
    res.status(500).json({ results: [], error: "Failed to fetch offers" });
  }
});

// ===== Product by ID مع ترجمة الوصف فقط
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";
  const cacheKey = `product:${id}`;

  try {
    let product = getCache(cacheKey);
    if (!product) {
      const rawGame = await axios
        .get(`https://api.rawg.io/api/games/${id}`, {
          params: { key: RAWG_API_KEY },
          timeout: AXIOS_TIMEOUT,
        })
        .then((r) => r.data);

      if (!rawGame) return res.status(404).json({ error: "Product not found" });

      const price = getFixedPrice(id);

      // ===== تحقق من العروض
      const offersCache = getCache("offers:fast");
      let discount = 0;
      if (offersCache && offersCache.results.some((g) => g.id === rawGame.id)) {
        const offerGame = offersCache.results.find((g) => g.id === rawGame.id);
        discount = Number(offerGame.discount) || 0;
      }

      product = {
        id: rawGame.id,
        name: rawGame.name,
        background_image: rawGame.background_image,
        rating: rawGame.rating ?? 0,
        ratings_count: rawGame.ratings_count ?? 0,
        price,
        discount,
        discountedPrice: price * (1 - discount / 100),
        description_raw: rawGame.description_raw || "",
      };

      setCache(cacheKey, product, 86400);
    }

    // ===== ترجمة الوصف فقط حسب اللغة المطلوبة
    const descCacheKey = `desc:${id}:${lang}`;
    let description = getCache(descCacheKey);
    if (!description) {
      description = await translateText(product.description_raw, lang);
      setCache(descCacheKey, description, 86400);
    }

    res.json({
      ...product,
      description: truncateWords(description, 50),
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ===== Prefetch عند تشغيل السيرفر
export const preloadData = async (logFn = console.log) => {
  try {
    await getOrFetch("products:fast", async () => {
      const rawGames = await fetchRawgGames([1, 2, 3, 4]);
      return {
        results: rawGames.map((game) => {
          const price = getFixedPrice(game.id);
          return {
            id: game.id,
            name: game.name || "Unknown",
            background_image: game.background_image,
            rating: game.rating ?? 0,
            ratings_count: game.ratings_count ?? 0,
            price,
          };
        }),
        count: rawGames.length,
      };
    }, 43200, logFn);

    await getOrFetch("offers:fast", async () => {
      const rawGames = await fetchRawgGames([5, 6]);
      return {
        results: rawGames.map((game) => {
          const price = getFixedPrice(game.id);
          const discount = 20;
          return {
            id: game.id,
            name: game.name || "Unknown",
            background_image: game.background_image,
            rating: game.rating ?? 0,
            ratings_count: game.ratings_count ?? 0,
            price,
            discount,
            discountedPrice: price * (1 - discount / 100),
          };
        }),
        count: rawGames.length,
      };
    }, 43200, logFn);

    logFn("✅ Prefetch done (products & offers cached)");
  } catch (err) {
    logFn(`❌ Error in preloadData: ${err.message}`);
  }
};

export default router;
