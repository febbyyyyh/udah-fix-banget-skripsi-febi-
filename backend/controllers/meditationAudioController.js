import db from "../config/db.js";
import fs from "fs";
import path from "path";

// Helper untuk hapus file fisik (hanya jika file lokal)
const deletePhysicalFile = (relativePaths) => {
    if (!relativePaths) return;
    // Jangan hapus jika berupa embed URL atau iframe
    if (
        relativePaths.startsWith("http://") ||
        relativePaths.startsWith("https://") ||
        relativePaths.startsWith("<iframe") ||
        relativePaths.startsWith("//")
    ) {
        return;
    }

    const cleanPath = relativePaths.startsWith('/') ? relativePaths.substring(1) : relativePaths;
    const absolutePath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, (err) => {
            if (err) console.error("Gagal hapus file fisik:", err);
            else console.log("File fisik berhasil dihapus:", cleanPath);
        });
    }
};

/* ================= CREATE AUDIO ================= */
export const createAudio = async (req, res) => {
    try {
        const { meditationTypeId } = req.params;
        const { title, embed_url } = req.body;

        // Ambil dari file fisik ATAU embed_url / audio_file teks
        let audio_file = null;
        if (req.file) {
            audio_file = `/uploads/meditation/audios/${req.file.filename}`;
        } else if (embed_url && embed_url.trim()) {
            audio_file = embed_url.trim();
        } else if (req.body.audio_file && req.body.audio_file.trim()) {
            audio_file = req.body.audio_file.trim();
        }

        if (!title || !title.trim() || !audio_file) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        const sql = `INSERT INTO meditation_audios (meditation_type_id, title, audio_file) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [meditationTypeId, title.trim(), audio_file]);

        return res.status(201).json({ message: "Berhasil", id: result.insertId, audio_file });
    } catch (err) {
        console.error("❌ Error createAudio:", err);
        return res.status(500).json({ message: "Gagal menambah audio: " + err.message });
    }
};

/* ================= GET AUDIO BY MEDITATION ================= */
export const getAudiosByMeditation = async (req, res) => {
    try {
        const { meditationTypeId } = req.params;
        const sql = `SELECT * FROM meditation_audios WHERE meditation_type_id = ? ORDER BY id DESC`;
        const [results] = await db.query(sql, [meditationTypeId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil audio" });
    }
};

/* ================= UPDATE AUDIO ================= */
export const updateAudio = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, embed_url } = req.body;

        // Validasi: title wajib diisi
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        const [existing] = await db.query(`SELECT audio_file FROM meditation_audios WHERE id = ?`, [id]);
        if (existing.length === 0) return res.status(404).json({ message: "Audio tidak ditemukan" });

        let sql = `UPDATE meditation_audios SET title = ?`;
        let params = [title.trim()];

        // Cek apakah ada file baru yang diunggah
        if (req.file) {
            deletePhysicalFile(existing[0].audio_file); // Hapus file lama jika lokal
            const newAudioPath = `/uploads/meditation/audios/${req.file.filename}`;
            sql += `, audio_file = ?`;
            params.push(newAudioPath);
        } else if (embed_url && embed_url.trim()) {
            // Update dengan embed URL baru
            deletePhysicalFile(existing[0].audio_file); // Hapus file lama jika sebelumnya lokal
            sql += `, audio_file = ?`;
            params.push(embed_url.trim());
        } else if (req.body.audio_file && req.body.audio_file.trim() && req.body.audio_file !== existing[0].audio_file) {
            deletePhysicalFile(existing[0].audio_file);
            sql += `, audio_file = ?`;
            params.push(req.body.audio_file.trim());
        }

        sql += ` WHERE id = ?`;
        params.push(id);

        await db.query(sql, params);
        res.json({ message: "Audio meditasi berhasil diperbarui" });
    } catch (err) {
        console.error("❌ Error updateAudio:", err);
        res.status(500).json({ message: "Gagal update audio: " + err.message });
    }
};

/* ================= DELETE AUDIO ================= */
export const deleteAudio = async (req, res) => {
    try {
        const { id } = req.params;
        const [audio] = await db.query(`SELECT audio_file FROM meditation_audios WHERE id = ?`, [id]);

        if (audio.length > 0) {
            deletePhysicalFile(audio[0].audio_file); // Hapus fisiknya hanya jika lokal
        }

        await db.query(`DELETE FROM meditation_audios WHERE id = ?`, [id]);
        res.json({ message: "Audio meditasi berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus audio" });
    }
};