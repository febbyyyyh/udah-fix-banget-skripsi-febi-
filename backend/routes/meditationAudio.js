import express from "express";
import {
    createAudio,
    getAudiosByMeditation,
    updateAudio,
    deleteAudio
} from "../controllers/meditationAudioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router({ mergeParams: true });

// Terapkan proteksi ke semua rute di bawah ini
router.use(verifyToken, adminOnly);

// GET tetap tanpa upload
router.get("/", getAudiosByMeditation);

// POST & PUT butuh upload.single agar req.body tidak undefined
router.post("/", upload.single("audio_file"), createAudio);
router.put("/:id", upload.single("audio_file"), updateAudio);
router.delete("/:id", deleteAudio);

export default router;