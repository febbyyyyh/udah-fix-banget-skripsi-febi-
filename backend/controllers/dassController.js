import db from "../config/db.js";

export const saveDassResult = async (req, res) => {
    try {
        const sessionId = req.cookies.session_id;
        const { depression_score, anxiety_score, stress_score } = req.body;

        if (!sessionId) return res.status(401).json({ message: "Session tidak ditemukan" });

        const scores = [
            { category: 'depression', score: depression_score },
            { category: 'anxiety', score: anxiety_score },
            { category: 'stress', score: stress_score }
        ];
        const highest = scores.sort((a, b) => b.score - a.score)[0];

        // 1. Cek apakah user ini sudah punya hasil tes
        const [existing] = await db.query(
            "SELECT id FROM dass_results WHERE session_id = ? LIMIT 1", // Tambahkan LIMIT 1
            [sessionId]
        );

        if (existing.length > 0) {
            // 2. Jika ada, UPDATE saja data yang lama
            await db.query(
                "UPDATE dass_results SET depression_score=?, anxiety_score=?, stress_score=?, result_category=?, created_at=NOW() WHERE session_id=?",
                [depression_score, anxiety_score, stress_score, highest.category, sessionId]
            );
            return res.json({ message: "Hasil diperbarui", recommendation: highest.category });
        } else {
            // 3. Jika belum ada, baru INSERT baru
            await db.query(
                "INSERT INTO dass_results (session_id, depression_score, anxiety_score, stress_score, result_category) VALUES (?, ?, ?, ?, ?)",
                [sessionId, depression_score, anxiety_score, stress_score, highest.category]
            );
            return res.status(201).json({ message: "Hasil disimpan", recommendation: highest.category });
        }
    } catch (error) {
        console.error("❌ Error save DASS:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getLastResult = async (req, res) => {
    try {
        const sessionId = req.cookies.session_id;
        if (!sessionId) return res.status(401).json({ message: "Session tidak ditemukan" });

        const [result] = await db.query(
            "SELECT depression_score, anxiety_score, stress_score FROM dass_results WHERE session_id = ? LIMIT 1",
            [sessionId]
        );

        if (result.length > 0) {
            // Kita petakan namanya agar sama dengan state di frontend
            return res.json({
                depression: result[0].depression_score,
                anxiety: result[0].anxiety_score,
                stress: result[0].stress_score
            });
        }
        res.status(404).json({ message: "Belum ada riwayat tes" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};