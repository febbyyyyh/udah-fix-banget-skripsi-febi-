import db from "../config/db.js";
import fs from "fs";
import path from "path";

// Helper untuk hapus file fisik video (hanya jika file lokal)
const deletePhysicalVideo = (filename) => {
    if (!filename) return;
    if (
        filename.startsWith("http://") ||
        filename.startsWith("https://") ||
        filename.startsWith("<iframe") ||
        filename.startsWith("//")
    ) {
        return;
    }
    const cleanPath = filename.startsWith('/') ? filename.substring(1) : filename;
    const filePath = path.isAbsolute(cleanPath)
        ? cleanPath
        : path.join(process.cwd(), "uploads/learngrow/videos", path.basename(cleanPath));

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log("File video fisik berhasil dihapus:", filePath);
        } catch (err) {
            console.error("Gagal hapus file video fisik:", err.message);
        }
    }
};

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
        const { title, playlist_id, embed_url } = req.body;

        // Ambil file fisik ATAU embed_url / video_file teks
        let videoFile = null;
        if (req.file) {
            videoFile = req.file.filename;
        } else if (embed_url && embed_url.trim()) {
            videoFile = embed_url.trim();
        } else if (req.body.video_file && req.body.video_file.trim()) {
            videoFile = req.body.video_file.trim();
        }

        // Validasi: semua field wajib diisi
        if (!title || !title.trim() || !videoFile) {
            console.log("Validation failed - title:", title, "videoFile:", videoFile);
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        const [result] = await db.query(
            "INSERT INTO learngrow_videos (playlist_id, title, video_file) VALUES (?, ?, ?)",
            [playlist_id, title.trim(), videoFile]
        );
        res.status(201).json({ message: "Video berhasil ditambahkan", id: result.insertId, video_file: videoFile });
    } catch (error) {
        console.error("Error in createVideo:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, embed_url } = req.body;

        // Validasi: title wajib diisi
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        const [old] = await db.query("SELECT video_file FROM learngrow_videos WHERE id = ?", [id]);
        if (old.length === 0) {
            return res.status(404).json({ message: "Video tidak ditemukan" });
        }

        if (req.file) {
            // File baru diunggah
            deletePhysicalVideo(old[0].video_file);
            await db.query("UPDATE learngrow_videos SET title=?, video_file=? WHERE id=?", [title.trim(), req.file.filename, id]);
        } else if (embed_url && embed_url.trim()) {
            // Embed URL baru
            deletePhysicalVideo(old[0].video_file);
            await db.query("UPDATE learngrow_videos SET title=?, video_file=? WHERE id=?", [title.trim(), embed_url.trim(), id]);
        } else if (req.body.video_file && req.body.video_file.trim() && req.body.video_file !== old[0].video_file) {
            deletePhysicalVideo(old[0].video_file);
            await db.query("UPDATE learngrow_videos SET title=?, video_file=? WHERE id=?", [title.trim(), req.body.video_file.trim(), id]);
        } else {
            // Hanya update title
            await db.query("UPDATE learngrow_videos SET title=? WHERE id=?", [title.trim(), id]);
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
            deletePhysicalVideo(data[0].video_file);
        }
        await db.query("DELETE FROM learngrow_videos WHERE id = ?", [id]);
        res.json({ message: "Video berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};