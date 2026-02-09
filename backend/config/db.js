import mysql from "mysql2/promise"; // Tambahkan /promise di sini
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Karena sekarang promise, kita tes koneksinya begini:
db.getConnection()
  .then(conn => {
    console.log("✅ Database Connected (Promise Mode)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err);
  });

export default db;