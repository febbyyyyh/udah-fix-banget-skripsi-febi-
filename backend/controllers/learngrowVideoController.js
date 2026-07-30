import db from "../config/db.js";
import fs from "fs";
import path from "path";

export const getVideosByPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const [rows] = await db.query("SELECT * FROM learngrow_videos WHERE playlist_id = ? ORDER BY id ASC", [playlistId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createVideo = async (req, res) => {
    try {
        console.log("=== createVideo DEBUG ===");
        console.log("req.body:", JSON.stringify(req.body));
        console.log("req.file:", req.file);
        console.log("req.files:", req.files);
        console.log("========================");

        const { title, playlist_id } = req.body;
        const videoFile = req.file ? req.file.filename : null;

        // Validasi: semua field wajib diisi
        if (!title || !title.trim() || !videoFile) {
            console.log("Validation failed - title:", title, "videoFile:", videoFile);
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        await db.query(
            "INSERT INTO learngrow_videos (playlist_id, title, video_file) VALUES (?, ?, ?)",
            [playlist_id, title, videoFile]
        );
        res.status(201).json({ message: "Video berhasil ditambahkan" });
    } catch (error) {
        console.error("Error in createVideo:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const newFile = req.file ? req.file.filename : null;

        // Validasi: title wajib diisi
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        if (newFile) {
            const [old] = await db.query("SELECT video_file FROM learngrow_videos WHERE id = ?", [id]);
            if (old[0]?.video_file) {
                const oldPath = path.join("uploads/learngrow/videos", old[0].video_file);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            await db.query("UPDATE learngrow_videos SET title=?, video_file=? WHERE id=?", [title, newFile, id]);
        } else {
            await db.query("UPDATE learngrow_videos SET title=? WHERE id=?", [title, id]);
        }
        res.json({ message: "Video berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await db.query("SELECT video_file FROM learngrow_videos WHERE id = ?", [id]);
        if (data[0]?.video_file) {
            const filePath = path.join("uploads/learngrow/videos", data[0].video_file);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await db.query("DELETE FROM learngrow_videos WHERE id = ?", [id]);
        res.json({ message: "Video berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};