import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import meditationRoutes from "./routes/meditation.js";
import meditationAudioRoutes from "./routes/meditationAudio.js";
import learngrowRoutes from "./routes/learngrow.js";
import db, { testDBConnection } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/* ================= MIDDLEWARE GLOBAL ================= */

// Daftar origin yang diizinkan mengakses API
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'http://172.16.222.8:3001', // IP Frontend VM
  'http://172.16.222.8:5000', // IP Backend VM
  'http://172.16.222.8:3001', // IP Frontend VM
  'http://172.16.222.8:5000', // IP Backend VM
  'http://mentalsehat.unsrat.ac.id', // Domain HTTP
  'https://mentalsehat.unsrat.ac.id', // Domain HTTPS
  'http://mentalsehat.unsrat.ac.id:3001',
  'http://103.84.116.31',               // Tambahan IP Publik
  'http://103.84.116.31:3001',          // Tambahan IP Publik dengan Port Frontend
  'http://103.84.116.31:5000',          // Tambahan IP Publik dengan Port Backend
];

// Konfigurasi CORS tunggal yang valid
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Cukup gunakan app.use(cors(...)) saja
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
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

  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
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
    } else {
      try {
        await db.query("ALTER TABLE meditation_audios MODIFY COLUMN audio_file TEXT NOT NULL");
        await db.query("ALTER TABLE learngrow_videos MODIFY COLUMN video_file TEXT NOT NULL");
        console.log("✅ Verified media columns (audio_file, video_file) are TEXT for embed support");
      } catch (alterErr) {
        console.warn("⚠️ Column check note:", alterErr.message);
      }
    }
  })();
});
