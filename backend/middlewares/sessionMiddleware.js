// middleware/sessionMiddleware.js
import db from "../config/db.js";

const sessionMiddleware = (req, res, next) => {
    const sessionId = req.cookies.session_id;

    // 1️⃣ cek cookie ada atau tidak
    if (!sessionId) {
        return res.status(401).json({
            message: "Session not found",
        });
    }

    // 2️⃣ cek session di database
    const query = `
    SELECT * FROM user_session 
    WHERE session_id = ? AND is_active = 1
    LIMIT 1
  `;

    db.query(query, [sessionId], (err, result) => {
        if (err) {
            console.error("Session middleware error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Session invalid or expired",
            });
        }

        const session = result[0];

        // 3️⃣ update last_access
        // db.query(
        //     "UPDATE user_session SET last_access = NOW() WHERE session_id = ?",
        //     [sessionId]
        // );

        // 4️⃣ inject user_id ke request
        req.user_id = session.user_id;
        req.session_id = session.session_id;

        next(); // lanjut ke controller
    });
};

export default sessionMiddleware;
