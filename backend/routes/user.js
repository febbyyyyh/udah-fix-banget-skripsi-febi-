import express from "express";
import crypto from "crypto";
import db from "../config/db.js";
import { getAllMeditations, getAudiosByMeditationId } from "../controllers/meditationController.js";
import { getPlaylists, getPlaylistDetailWithVideos } from "../controllers/learngrowController.js";
import { saveDassResult, getLastResult} from "../controllers/dassController.js";
import { getRecommendation } from "../controllers/meditationController.js";

const router = express.Router();

router.get("/init", async (req, res) => { // Tambahkan async
    let sessionId = req.cookies.session_id;

    try {
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            const now = new Date();

            await db.query(
                `INSERT INTO user_session (session_id, first_access, last_access) VALUES (?, ?, ?)`,
                [sessionId, now, now]
            );

            res.cookie("session_id", sessionId, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000
            });

            return res.json({ message: "New session created", sessionId });
        } else {
            await db.query(
                "UPDATE user_session SET last_access = ? WHERE session_id = ?",
                [new Date(), sessionId]
            );
            return res.json({ message: "Welcome back", sessionId });
        }
    } catch (err) {
        console.error("❌ Session Error:", err);
        return res.status(500).json({ error: "Database error" });
    }
});

router.post("/dass/save", saveDassResult);
router.get("/meditation/recommendation", getRecommendation);
router.get("/dass/last-result", getLastResult)

router.get("/meditations", getAllMeditations);
router.get("/meditations/:id/audios", getAudiosByMeditationId);

// Route Education untuk User
router.get("/education", getPlaylists);
router.get("/education/:id", getPlaylistDetailWithVideos);

export default router;