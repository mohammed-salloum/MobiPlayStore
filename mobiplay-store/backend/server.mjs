import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import express from "express";
import cors from "cors";
import gamesRouter, { preloadData as preloadCache } from "./routes/games.mjs";

// ===== إعداد ملفات اللوج
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const serverLog = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });
const cacheLog = fs.createWriteStream(path.join(logsDir, 'cache.log'), { flags: 'a' });

const isDev = process.env.NODE_ENV !== "production";

const logServer = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  serverLog.write(line);
  if (isDev) console.log(msg);
};

const logCache = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  cacheLog.write(line);
  if (isDev) console.log(msg);
};

// ===== Express setup
const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS setup
app.use(cors({
  origin: ["https://mobiplaystore-syr.web.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ===== Mount routes
app.use("/api/games", gamesRouter);

// ===== Serve React SPA
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ===== Health check
app.get("/health", (req, res) => res.send("API is running!"));

// ===== Start server
app.listen(PORT, async () => {
  logServer(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await preloadCache(logCache);
    logServer("✅ Cache preloaded at startup");
  } catch (err) {
    logServer(`❌ Error preloading cache: ${err.message}`);
  }
});

// ===== تحديث الكاش كل 24 ساعة
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
