import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";

// Import Controllers
import {
    getPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
} from "../controllers/learngrowController.js";

import {
    getVideosByPlaylist,
    createVideo,
    updateVideo,
    deleteVideo
} from "../controllers/learngrowVideoController.js";

// Import Middlewares
import { verifyToken } from "../middlewares/verifyToken.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

/* ==============================
   MULTER CONFIGURATION (PERBAIKAN)
   ============================== */

const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/learngrow/covers";
        // Tambahkan pengecekan ini:
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, "cover-" + Date.now() + path.extname(file.originalname));
    },
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/learngrow/videos";
        // Tambahkan pengecekan ini:
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, "video-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadCover = multer({ storage: coverStorage });
const uploadVideo = multer({ storage: videoStorage });

/* ==============================
   PLAYLIST ROUTES (LEARN & GROW)
   ============================== */

// Akses Publik/User (Hanya Lihat)
router.get("/playlists", getPlaylists);
router.get("/playlists/:id", getPlaylistById);

// Akses Admin (Kelola Playlist) - MIDDLEWARE UPLOADCOVER DICOPOT ❌
router.post(
    "/playlists",
    verifyToken,
    adminOnly,
    // No multer here — accept JSON body for creating playlist
    createPlaylist // Langsung memanggil controller
);

// Temporary debug endpoint (no auth) to verify multipart parsing during development
router.post(
    "/playlists/test",
    uploadCover.none(),
    (req, res) => {
        console.log("[DEBUG] /playlists/test headers:", req.headers);
        console.log("[DEBUG] /playlists/test body:", req.body);
        res.json({ ok: true, body: req.body });
    }
);

// Debug: list internal routes of this router
router.get("/routes", (req, res) => {
    const list = [];
    router.stack.forEach((layer) => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(',');
            list.push({ path: layer.route.path, methods });
        }
    });
    res.json(list);
});

router.put(
    "/playlists/:id",
    verifyToken,
    adminOnly,
    updatePlaylist // Langsung memanggil controller
);

router.delete(
    "/playlists/:id",
    verifyToken,
    adminOnly,
    deletePlaylist
);

/* ==============================
   VIDEO ROUTES (ISI EDUKASI)
   ============================== */

// Akses Publik/User (Ambil video berdasarkan ID Playlist)
router.get(
    "/playlists/:playlistId/videos",
    getVideosByPlaylist
);

// Akses Admin (Kelola Video)
router.post(
    "/videos",
    verifyToken,
    adminOnly,
    uploadVideo.single("video_file"),
    createVideo
);

router.put(
    "/videos/:id",
    verifyToken,
    adminOnly,
    uploadVideo.single("video_file"),
    updateVideo
);

router.delete(
    "/videos/:id",
    verifyToken,
    adminOnly,
    deleteVideo
);

export default router;