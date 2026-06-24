import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDBConnection(options = {}) {
  const { retries = 3, delay = 2000 } = options;

  if (!process.env.DB_HOST) {
    console.warn("⚠️ DB_HOST not set. Skipping DB connectivity test.");
    return false;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const conn = await pool.getConnection();
      console.log("✅ Database Connected (Promise Mode)");
      conn.release();
      return true;
    } catch (err) {
      console.error("❌ DB Connection Error:", err.message || err);
      if (attempt < retries) {
        console.log(`Retrying DB connection in ${delay}ms... (${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  return false;
}

export default pool;
export { testDBConnection };