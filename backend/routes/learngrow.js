import express from "express";
import path from "path";
import multer from "multer";

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
   MULTER CONFIGURATION
   ============================== */

// Konfigurasi penyimpanan untuk Cover Playlist
const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/learngrow/covers");
    },
    filename: (req, file, cb) => {
        cb(null, "cover-" + Date.now() + path.extname(file.originalname));
    },
});

// Konfigurasi penyimpanan untuk File Video
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/learngrow/videos");
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

// Akses Admin (Kelola Playlist)
router.post(
    "/playlists",
    verifyToken,
    adminOnly,
    uploadCover.single("cover_image"),
    createPlaylist
);

router.put(
    "/playlists/:id",
    verifyToken,
    adminOnly,
    uploadCover.single("cover_image"),
    updatePlaylist
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