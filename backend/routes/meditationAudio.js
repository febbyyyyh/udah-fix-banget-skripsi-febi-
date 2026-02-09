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

router.post("/", (req, res, next) => {
    console.log("--> Step 1: Request Masuk ke Rute");
    next();
}, upload.single("audio_file"), (req, res, next) => {
    console.log("--> Step 2: Multer Berhasil Proses File");
    next();
}, createAudio);

router.delete("/:id", deleteAudio);

export default router;