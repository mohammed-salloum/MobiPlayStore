import 'dotenv/config'; // Load environment variables from .env file
import fs from 'fs';
import path from 'path';
import express from "express";
import cors from "cors";
import gamesRouter, { preloadData as preloadCache } from "./routes/games.mjs";

// ===== Setup logging files =====
const logsDir = path.join(process.cwd(), 'logs');
// Create logs directory if it does not exist
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Create writable streams for server and cache logs
const serverLog = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });
const cacheLog = fs.createWriteStream(path.join(logsDir, 'cache.log'), { flags: 'a' });

// Detect if the app is running in development mode
const isDev = process.env.NODE_ENV !== "production";

// Log helper for server events
const logServer = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  serverLog.write(line);
  if (isDev) console.log(msg); // Print to console only in dev
};

// Log helper for cache events
const logCache = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  cacheLog.write(line);
  if (isDev) console.log(msg); // Print to console only in dev
};

// ===== Express application setup =====
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for cross-origin requests
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// Mount games routes under /api/games
app.use("/api/games", gamesRouter);

// ===== Health check endpoint =====
app.get("/", (req, res) => res.send("API is running!"));

// ===== Start server =====
app.listen(PORT, async () => {
  logServer(`🚀 Server running on http://localhost:${PORT}`);
  try {
    // Preload all products and offers into cache (with translations if missing)
    await preloadCache(logCache);
    logServer("✅ Cache preloaded at startup");
  } catch (err) {
    logServer(`❌ Error preloading cache: ${err.message}`);
  }
});

// ===== Refresh cache every 24 hours =====
const ONE_DAY = 24 * 60 * 60 * 1000;
setInterval(async () => {
  logServer("⏳ Updating cache...");
  try {
    await preloadCache(logCache);
    logServer("✅ Cache updated!");
  } catch (err) {
    logServer(`❌ Cache update failed: ${err.message}`);
  }
}, ONE_DAY);
