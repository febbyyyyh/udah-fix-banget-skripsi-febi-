import db from "../config/db.js";
import fs from "fs";
import path from "path";

/* ================== ADMIN & GENERAL ACCESS ================== */

// Ambil semua playlist
export const getPlaylists = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM learngrow_playlists ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ambil playlist berdasarkan ID (Hanya info playlist)
export const getPlaylistById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM learngrow_playlists WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Playlist tidak ditemukan" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buat playlist baru (MODIFIKASI: Tanpa Cover Image)
export const createPlaylist = async (req, res) => {
    try {
        // DEBUG: Cek data teks yang masuk
        console.log("Body:", req.body);

        // Safely read body in case multipart parsing failed
        const name = req.body?.name;
        const description = req.body?.description;

        if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
            console.error("createPlaylist: req.body is empty or undefined. Headers:", req.headers);
            return res.status(400).json({ message: "Request body tidak ditemukan. Pastikan request dikirim sebagai multipart/form-data atau application/json." });
        }

        // Validasi hanya mengecek nama dan deskripsi teks saja
        if (!name || !description) {
            return res.status(400).json({
                message: "Gagal simpan. Semua kolom wajib diisi."
            });
        }

        // Simpan ke database tanpa mengisi kolom cover_image (diisi NULL atau kosong sesuai skema DB)
        console.log("createPlaylist: inserting playlist", { name, description });
        try {
            await db.query(
                "INSERT INTO learngrow_playlists (name, description, cover_image) VALUES (?, ?, NULL)",
                [name, description]
            );
        } catch (dbErr) {
            console.error("DB Error inserting playlist:", dbErr);
            return res.status(500).json({ message: "Gagal menyimpan playlist ke database", detail: dbErr.sqlMessage || dbErr.message });
        }

        res.status(201).json({ message: "Playlist berhasil dibuat" });
    } catch (error) {
        console.error("Error Create Playlist:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update playlist (MODIFIKASI: Tanpa Memproses Cover Image)
export const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        // Murni hanya mengupdate teks informasi saja
        await db.query(
            "UPDATE learngrow_playlists SET name=?, description=? WHERE id=?",
            [name, description, id]
        );

        res.json({ message: "Playlist berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hapus playlist beserta isinya
export const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Hapus semua file video fisik
        const [videos] = await db.query("SELECT video_file FROM learngrow_videos WHERE playlist_id = ?", [id]);
        videos.forEach(v => {
            if (v.video_file) {
                const vPath = path.join(process.cwd(), "uploads/learngrow/videos", v.video_file);
                if (fs.existsSync(vPath)) fs.unlinkSync(vPath);
            }
        });

        // 2. Hapus file cover playlist
        const [playlist] = await db.query("SELECT cover_image FROM learngrow_playlists WHERE id = ?", [id]);
        if (playlist[0]?.cover_image) {
            const cPath = path.join(process.cwd(), "uploads/learngrow/covers", playlist[0].cover_image);
            if (fs.existsSync(cPath)) fs.unlinkSync(cPath);
        }

        // 3. Hapus database
        await db.query("DELETE FROM learngrow_videos WHERE playlist_id = ?", [id]);
        await db.query("DELETE FROM learngrow_playlists WHERE id = ?", [id]);

        res.json({ message: "Playlist dan isinya berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================== USER ACCESS ================== */

// Fungsi untuk mengambil detail playlist beserta daftar videonya (Digunakan di EducationDetail.jsx)
export const getPlaylistDetailWithVideos = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Ambil info playlist
        const [playlist] = await db.query(
            "SELECT * FROM learngrow_playlists WHERE id = ?",
            [id]
        );

        if (playlist.length === 0) {
            return res.status(404).json({ message: "Konten edukasi tidak ditemukan" });
        }

        // 2. Ambil semua video yang masuk dalam playlist_id ini
        const [videos] = await db.query(
            "SELECT * FROM learngrow_videos WHERE playlist_id = ? ORDER BY created_at ASC",
            [id]
        );

        res.json({
            playlist: playlist[0],
            videos: videos
        });
    } catch (err) {
        console.error("❌ Error Get Education Detail:", err);
        res.status(500).json({ message: err.message });
    }
};