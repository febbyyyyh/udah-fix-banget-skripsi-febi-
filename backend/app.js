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

dotenv.config();

// Konfigurasi __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================= MIDDLEWARE GLOBAL ================= */
app.use(cors({
  origin: "http://localhost:5173", // Pastikan ini sesuai URL Vite kamu
  credentials: true, // 🚨 WAJIB TRUE agar cookie bisa lewat
}));

app.use(express.json());
app.use(cookieParser()); // boleh ada, tapi admin TIDAK pakai cookie

/* ================= STATIC FOLDER ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
});