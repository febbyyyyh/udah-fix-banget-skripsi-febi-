import express from "express";
import {
    createMeditationType,
    getAllMeditations,
    getMeditationById,
    updateMeditation,
    deleteMeditation
} from "../controllers/meditationController.js";

// --- IMPORT CONTROLLER AUDIO ---
import {
    getAudiosByMeditation,
    createAudio,
    updateAudio,
    deleteAudio
} from "../controllers/meditationAudioController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(verifyToken, adminOnly);

// --- RUTE MEDITASI (Kategori) ---
router.get("/", getAllMeditations);
router.get("/:id", getMeditationById);
router.post("/", upload.single("cover_image"), createMeditationType);
router.put("/:id", upload.single("cover_image"), updateMeditation);
router.delete("/:id", deleteMeditation);

// --- RUTE AUDIO (Ini yang Tadi Hilang!) ---
// Gunakan :meditationTypeId agar sinkron dengan req.params di Controller
router.get("/:meditationTypeId/audios", getAudiosByMeditation);
router.post("/:meditationTypeId/audios", upload.single("audio_file"), createAudio);
router.put("/:meditationTypeId/audios/:id", upload.single("audio_file"), updateAudio);
router.delete("/:meditationTypeId/audios/:id", deleteAudio);

export default router;