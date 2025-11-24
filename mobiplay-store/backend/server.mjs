import 'dotenv/config'; // Load environment variables from .env file
import fs from 'fs';
import path from 'path';
import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games.mjs"; // استيراد الروتر فقط
import authRouter from "./routes/auth.mjs"; // Authentication routes

// ===== Setup logging files =====
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

// ===== Express application setup =====
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// ===== Serve uploaded files =====
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOADS_DIR));

// ===== Mount routes =====
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);

// ===== Health check =====
app.get("/", (req, res) => res.send("API is running!"));

// ===== Start server =====
app.listen(PORT, () => {
  logServer(`🚀 Server running on http://localhost:${PORT}`);
});

// ===== Refresh cache every 24 hours =====
// إذا كنت تريد لاحقًا عمل preloading، يمكن إضافته داخل router نفسه
