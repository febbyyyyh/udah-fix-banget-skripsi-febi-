import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // Tambahan: Untuk mengelola path file
import { fileURLToPath } from "url"; // Tambahan: Untuk ES Modules __dirname

import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import meditationRoutes from "./routes/meditation.js";
import meditationAudioRoutes from "./routes/meditationAudio.js";
import learngrowRoutes from "./routes/learngrow.js";
import db, { testDBConnection } from "./config/db.js";

dotenv.config();

// Konfigurasi __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Jika berjalan di produksi di balik reverse proxy, beri tahu Express untuk mempercayai proxy.
// Ini diperlukan agar cookie yang diset dengan `secure: true` tetap dikirim ketika TLS
// di-terminate oleh proxy (mis. nginx, Heroku).
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/* ================= MIDDLEWARE GLOBAL ================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // boleh ada, tapi admin TIDAK pakai cookie

/* ================= STATIC FOLDER ================= */
app.use('/uploads', express.static('uploads'));

/* ================= ROUTES ================= */

// AUTH ADMIN (PUBLIC)
app.use("/api/admin", adminAuthRoutes);

// DASHBOARD ADMIN (PROTECTED)
app.use("/api/admin", adminRoutes);

// ADMIN CRUD (PROTECTED VIA MIDDLEWARE DI ROUTE)
app.use("/api/admin/meditations", meditationRoutes);
app.use(
  "/api/admin/meditations/:meditationTypeId/audios",
  meditationAudioRoutes
);
app.use("/api/admin/learngrow", learngrowRoutes);

// USER
app.use("/api/user", userRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("API RUNNING");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  // Log registered routes for debugging
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        routes.push(middleware.route.path);
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push(handler.route.path ? `${middleware.regexp}/${handler.route.path}` : handler.route.path);
          }
        });
      }
    });
    console.log('Registered routes:', routes.slice(0, 200));
  } catch (e) {
    console.warn('Unable to enumerate routes:', e.message || e);
  }
  (async () => {
    const ok = await testDBConnection({ retries: 3, delay: 2000 });
    if (!ok) {
      console.warn("⚠️ Unable to connect to DB after retries. Check your .env and network settings.");
    }
  })();
});