import db from "../config/db.js";

const getSeverityWeight = (type, score) => {
    if (type === "depression") {
        if (score <= 9) return 1; // Normal
        if (score <= 13) return 2; // Ringan
        if (score <= 20) return 3; // Sedang
        if (score <= 27) return 4; // Berat
        return 5; // Sangat Berat
    }
    if (type === "anxiety") {
        if (score <= 7) return 1;
        if (score <= 9) return 2;
        if (score <= 14) return 3;
        if (score <= 19) return 4;
        return 5;
    }
    if (type === "stress") {
        if (score <= 14) return 1;
        if (score <= 18) return 2;
        if (score <= 25) return 3;
        if (score <= 33) return 4;
        return 5;
    }
    return 1;
};

export const saveDassResult = async (req, res) => {
    try {
        const sessionId = req.cookies.session_id;
        const { depression_score, anxiety_score, stress_score } = req.body;

        if (!sessionId) return res.status(401).json({ message: "Session tidak ditemukan" });

        // Tentukan prioritas kategori
        const categories = [
            { name: 'depression', weight: getSeverityWeight('depression', depression_score), raw: depression_score },
            { name: 'anxiety', weight: getSeverityWeight('anxiety', anxiety_score), raw: anxiety_score },
            { name: 'stress', weight: getSeverityWeight('stress', stress_score), raw: stress_score }
        ];

        const highest = categories.sort((a, b) => {
            if (b.weight !== a.weight) return b.weight - a.weight;
            return b.raw - a.raw;
        })[0];

        // QUERY TUNGGAL: Insert jika baru, Update jika sudah ada session_id yang sama
        const query = `
            INSERT INTO dass_results (session_id, depression_score, anxiety_score, stress_score, result_category) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            depression_score = VALUES(depression_score),
            anxiety_score = VALUES(anxiety_score),
            stress_score = VALUES(stress_score),
            result_category = VALUES(result_category),
            created_at = NOW()
        `;

        await db.query(query, [sessionId, depression_score, anxiety_score, stress_score, highest.name]);

        return res.status(200).json({
            message: "Hasil berhasil diproses",
            recommendation: highest.name
        });

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