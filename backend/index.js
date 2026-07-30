import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // Tambahan: Untuk mengelola path file
import { fileURLToPath } from "url"; // Tambahan: Untuk ES Modules __dirname
import fs from "fs"; // Tambahan: Untuk membuat folder otomatis

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
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Mengambil URL dari .env untuk produksi
  credentials: true, // 🚨 WAJIB TRUE agar cookie bisa lewat
}));

app.use(express.json());
app.use(cookieParser()); // boleh ada, tapi admin TIDAK pakai cookie

/* ================= STATIC FOLDER ================= */
// Buat folder uploads otomatis jika belum ada untuk mencegah error saat pertama kali deploy
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("✅ Created 'uploads' directory");
}
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

// Serve frontend statis untuk testing local
const frontendPath = path.join(__dirname, "../titik-jeda/dist");
app.use(express.static(frontendPath));

app.use((req, res, next) => {
    // Abaikan API route agar diteruskan ke 404/handler berikutnya
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
});

// DEBUG ROUTE (hapus setelah deploy berhasil)
app.get("/api/debug", async (req, res) => {
  const info = {
    env_loaded: !!process.env.DB_HOST,
    DB_HOST: process.env.DB_HOST || "TIDAK ADA",
    DB_USER: process.env.DB_USER || "TIDAK ADA",
    DB_NAME: process.env.DB_NAME || "TIDAK ADA",
    PORT: process.env.PORT || "TIDAK ADA",
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
  };
  try {
    const [rows] = await db.query("SELECT 1+1 AS result");
    info.db_connection = "✅ BERHASIL";
    info.db_test_query = rows[0].result;
  } catch (err) {
    info.db_connection = "❌ GAGAL";
    info.db_error = err.message;
    info.db_error_code = err.code;
  }
  res.json(info);
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  (async () => {
    const ok = await testDBConnection({ retries: 3, delay: 2000 });
    if (!ok) {
      console.warn("⚠️ Unable to connect to DB after retries. Check your .env and network settings.");
    }
  })();
});