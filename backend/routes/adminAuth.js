import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();

console.log("✅ adminAuthRoutes loaded");

/* ================= LOGIN ADMIN ================= */
router.post("/login", async (req, res) => { // Tambahkan async
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    try {
        // Ganti db.query callback menjadi await
        const [results] = await db.query(
            "SELECT * FROM admin WHERE email = ? LIMIT 1",
            [email]
        );

        if (!results || results.length === 0) {
            return res.status(401).json({ message: "Admin tidak ditemukan" });
        }

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Password salah" });
        }

        const token = jwt.sign(
            { admin_id: admin.admin_id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.status(200).json({ message: "Login admin berhasil", token });

    } catch (error) {
        console.error("🔥 Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

/* ================= LOGOUT ADMIN ================= */
router.post("/logout", (req, res) => {
    // JWT stateless → frontend hapus token
    return res.status(200).json({
        message: "Logout admin berhasil",
    });
});

export default router;
