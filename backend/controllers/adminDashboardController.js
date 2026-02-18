import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Audio
        const [audio] = await db.query("SELECT COUNT(*) as total FROM meditation_audios");

        // 2. Total Video
        const [video] = await db.query("SELECT COUNT(*) as total FROM learngrow_videos");

        // 3. Total Sesi Aktif (7 hari terakhir)
        const [sessions] = await db.query(
            "SELECT COUNT(*) as total FROM user_session WHERE last_access >= NOW() - INTERVAL 7 DAY"
        );

        // 4. Analisis DASS (7 hari terakhir)
        const [dass] = await db.query(`
            SELECT result_category, COUNT(*) as count 
            FROM dass_results 
            WHERE created_at >= NOW() - INTERVAL 7 DAY
            GROUP BY result_category
        `);

        // 5. Table hasil DASS (7 hari terakhir)
        const [recentDass] = await db.query(`
            SELECT session_id, depression_score, anxiety_score, stress_score, result_category, created_at 
            FROM dass_results 
            ORDER BY created_at DESC 
            LIMIT 10
`);

        res.json({
            success: true,
            data: {
                totalAudio: audio[0].total || 0,
                totalVideo: video[0].total || 0,
                activeSessions: sessions[0].total || 0,
                dassAnalysis: dass,
                recentDass: recentDass // <--- Tambahkan ini
            }
        });
    } catch (error) {
        console.error("Error Dashboard:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
};