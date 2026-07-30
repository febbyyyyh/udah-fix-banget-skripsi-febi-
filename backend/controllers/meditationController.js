import db from "../config/db.js";
import fs from "fs";
import path from "path";

// Helper hapus file fisik
const deletePhysicalFile = (relativePaths) => {
    if (!relativePaths) return;
    const cleanPath = relativePaths.startsWith('/') ? relativePaths.substring(1) : relativePaths;
    const absolutePath = path.join(process.cwd(), cleanPath);
    if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, (err) => {
            if (err) console.error("Gagal hapus file fisik:", err);
            else console.log("File fisik berhasil dihapus:", cleanPath);
        });
    }
};

/* ================== MEDITATION TYPES ================== */

// CREATE meditation type
export const createMeditationType = async (req, res) => {
    try {
        const { name, description, category_type } = req.body;
        
        // Validasi: semua field wajib diisi
        if (!name || !name.trim() || !description || !description.trim() || !category_type) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }
        
        // No cover image handling: store NULL in cover_image column
        const sql = `INSERT INTO meditation_types (name, description, cover_image, category_type) VALUES (?, ?, NULL, ?)`;
        const [result] = await db.query(sql, [name, description, category_type || null]);

        res.status(201).json({
            message: "Meditation type berhasil dibuat",
            id: result.insertId
        });
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// GET all meditation types (Sudah diperbaiki untuk Promise Mode)
export const getAllMeditations = async (req, res) => {
    try {
        // Gunakan destructuring [results] karena db.query mengembalikan array [data, fields]
        const [results] = await db.query(`SELECT * FROM meditation_types ORDER BY created_at DESC`);

        console.log("✅ Data dari DB ditemukan:", results.length);
        res.json(results);
    } catch (err) {
        console.error("❌ Error Database:", err);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// GET meditation type by id
export const getMeditationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query(`SELECT * FROM meditation_types WHERE id = ?`, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Meditasi tidak ditemukan" });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE meditation type
export const updateMeditation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category_type } = req.body;

        // Validasi: semua field wajib diisi
        if (!name || !name.trim() || !description || !description.trim() || !category_type) {
            return res.status(400).json({ message: "Gagal simpan. Semua kolom wajib diisi." });
        }

        const [existing] = await db.query(`SELECT id FROM meditation_types WHERE id = ?`, [id]);
        if (existing.length === 0) return res.status(404).json({ message: "Meditasi tidak ditemukan" });

        // Update only text fields and category_type; we intentionally keep cover_image NULL
        const sql = `UPDATE meditation_types SET name = ?, description = ?, category_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        await db.query(sql, [name, description, category_type || null, id]);

        res.json({ message: "Meditasi berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE meditation type
export const deleteMeditation = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query(`SELECT cover_image FROM meditation_types WHERE id = ?`, [id]);

        if (existing.length > 0) {
            deletePhysicalFile(existing[0].cover_image); // Hapus file fisik
        }

        await db.query(`DELETE FROM meditation_types WHERE id = ?`, [id]);
        res.json({ message: "Meditasi berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tambahkan di paling bawah
export const getAudiosByMeditationId = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Ambil detail kategori
        const [typeInfo] = await db.query(
            `SELECT name, description, cover_image FROM meditation_types WHERE id = ?`,
            [id]
        );

        if (typeInfo.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        // 2. Ambil semua audio di dalam kategori tersebut
        const [audios] = await db.query(
            `SELECT * FROM meditation_audios WHERE meditation_type_id = ? ORDER BY created_at ASC`,
            [id]
        );

        res.json({
            category: typeInfo[0],
            audios: audios
        });
    } catch (err) {
        console.error("❌ Error Get Audios:", err);
        res.status(500).json({ message: err.message });
    }
};

export const getRecommendation = async (req, res) => {
    try {
        const sessionId = req.cookies.session_id;

        if (!sessionId) {
            return res.json({ message: "Session tidak ditemukan", data: [] });
        }

        // 1. Ambil kategori DASS terbaru berdasarkan session_id
        const [dassResult] = await db.query(
            "SELECT result_category FROM dass_results WHERE session_id = ? ORDER BY created_at DESC LIMIT 1",
            [sessionId]
        );

        // Jika user belum pernah tes
        if (dassResult.length === 0) {
            return res.json({ message: "Belum ada hasil tes", data: [] });
        }

        const category = dassResult[0].result_category;

        // 2. Query audio menggunakan nama kolom yang benar: meditation_type_id
        const fallbackName = category === "depression" ? "%Depression%" : category === "anxiety" ? "%Anxiety%" : "%Stress%";

        const [meditations] = await db.query(
            `SELECT ma.*, mt.name as type_name, mt.id as meditation_type_id 
             FROM meditation_audios ma
             JOIN meditation_types mt ON ma.meditation_type_id = mt.id
             WHERE mt.category_type = ?
               OR mt.name LIKE ?
             ORDER BY ma.created_at ASC`,
            [category, fallbackName]
        );

        const [recommendedType] = await db.query(
            `SELECT id, name FROM meditation_types 
             WHERE category_type = ?
               OR name LIKE ?
             ORDER BY created_at DESC LIMIT 1`,
            [category, fallbackName]
        );

        res.json({
            category_name: category,
            recommended_meditation_type_id: recommendedType[0]?.id || null,
            recommended_meditation_type_name: recommendedType[0]?.name || null,
            data: meditations
        });
    } catch (error) {
        console.error("❌ Error Recommendation API:", error);
        res.status(500).json({ message: error.message });
    }
};