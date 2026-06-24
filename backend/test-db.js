import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const c = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  connectTimeout: 5000
};

(async () => {
  try {
    const conn = await mysql.createConnection(c);
    console.log('✅ Test DB Connection OK');
    await conn.end();
  } catch (e) {
    console.error('❌ Test DB Connection Failed:', e.message || e);
    process.exit(1);
  }
})();
