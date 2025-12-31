import 'dotenv/config'; // Load environment variables from .env file
import fs from 'fs';
import path from 'path';
import express from "express";
import cors from "cors";

// Import routers
import gamesRouter from "./routes/games.mjs"; // Game-related API routes
import authRouter from "./routes/auth.mjs";   // Authentication API routes

// ===== Setup logging files =====
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Create write streams for server and cache logs
const serverLog = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });
const cacheLog = fs.createWriteStream(path.join(logsDir, 'cache.log'), { flags: 'a' });

// Check if running in development mode
const isDev = process.env.NODE_ENV !== "production";

// Utility function to log server messages
const logServer = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  serverLog.write(line);           // Write to server log file
  if (isDev) console.log(msg);    // Also print to console in development
};

// Utility function to log cache messages
const logCache = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  cacheLog.write(line);            // Write to cache log file
  if (isDev) console.log(msg);    // Also print to console in development
};

// ===== Express application setup =====
const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON request body parsing
app.use(express.json());

// ===== Serve uploaded files =====
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Make uploads folder publicly accessible at /uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// ===== Mount API routes =====
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);

// ===== Health check endpoint =====
app.get("/", (req, res) => res.send("API is running!"));

// ===== Start server =====
app.listen(PORT, () => {
  logServer(`🚀 Server running on http://localhost:${PORT}`);
});

// ===== Refresh cache every 24 hours =====
// Future enhancement: preloading or cache refresh logic can be added inside routers
