import express from "express";
import crypto from "crypto";
import db from "../config/db.js";
import { getAllMeditations, getAudiosByMeditationId, getRecommendation } from "../controllers/meditationController.js";
import { getPlaylists, getPlaylistDetailWithVideos } from "../controllers/learngrowController.js";
import { saveDassResult, getLastResult } from "../controllers/dassController.js";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

router.get("/init", async (req, res) => {
    let sessionId = req.cookies.session_id;

    try {
        if (!sessionId) {
            // 1. BUAT SESSION BARU
            const newSessionId = crypto.randomUUID();
            const now = new Date();

            // HANYA menggunakan 3 kolom sesuai tabel kamu: session_id, first_access, last_access
            await db.query(
                `INSERT IGNORE INTO user_session (session_id, first_access, last_access) VALUES (?, ?, ?)`,
                [newSessionId, now, now]
            );

            res.cookie("session_id", newSessionId, {
                httpOnly: true,
                secure: isProd,
                sameSite: "lax",
                maxAge: 72 * 60 * 60 * 1000
            });

            return res.json({ message: "New session created", sessionId: newSessionId });

        } else {
            // 2. CEK APAKAH SESSION DI COOKIE ADA DI DATABASE
            const [rows] = await db.query(
                "SELECT session_id FROM user_session WHERE session_id = ? LIMIT 1",
                [sessionId]
            );

            if (rows.length === 0) {
                // Jika tidak ada di DB, buatkan ulang
                const fallbackId = crypto.randomUUID();
                const now = new Date();
                await db.query(
                    `INSERT INTO user_session (session_id, first_access, last_access) VALUES (?, ?, ?)`,
                    [fallbackId, now, now]
                );
                res.cookie("session_id", fallbackId, { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 72 * 60 * 60 * 1000 });
                return res.json({ message: "Session restored", sessionId: fallbackId });
            }

            // 3. UPDATE WAKTU AKSES TERAKHIR
            await db.query(
                "UPDATE user_session SET last_access = NOW() WHERE session_id = ?",
                [sessionId]
            );

            return res.json({ message: "Welcome back", sessionId });
        }
    } catch (err) {
        console.error("❌ Session Error:", err.message);
        // Kirim sessionId agar frontend tidak white screen meskipun DB error
        return res.status(200).json({
            message: "Session processed",
            sessionId: sessionId || "error-fallback"
        });
    }
});

/* ================= ROUTES LAINNYA ================= */
router.post("/dass/save", saveDassResult);
router.get("/meditation/recommendation", getRecommendation);
router.get("/dass/last-result", getLastResult);
router.get("/meditations", getAllMeditations);
router.get("/meditations/:id/audios", getAudiosByMeditationId);
router.get("/education", getPlaylists);
router.get("/education/:id", getPlaylistDetailWithVideos);

export default router;