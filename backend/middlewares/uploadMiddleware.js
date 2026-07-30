import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = "";
        if (file.fieldname === "cover_image") {
            dest = "uploads/meditation/covers/";
        } else if (file.fieldname === "audio_file") {
            dest = "uploads/meditation/audios/";
        }

        // --- SOLUSI: Cek & Buat folder otomatis jika belum ada ---
        if (dest !== "" && !fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });