import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
async function run() {
  const pool = mysql.createPool({ host: process.env.DB_HOST ?? '127.0.0.1', user: process.env.DB_USER ?? 'sql_titikjeda_online', password: process.env.DB_PASSWORD ?? 'ec5d2cc0c70bf8', database: process.env.DB_NAME ?? 'sql_titikjeda_online' });
  try { await pool.query("ALTER TABLE meditation_types ADD COLUMN category_type ENUM('depression', 'anxiety', 'stress', 'general') DEFAULT 'general'"); console.log('Added category_type'); } catch(e) { console.error('Error adding category_type:', e.message); }
  try { await pool.query('ALTER TABLE meditation_types DROP COLUMN cover_image'); console.log('Dropped cover_image from meditation_types'); } catch(e) { console.error('Error dropping cover_image:', e.message); }
  try { await pool.query('ALTER TABLE learngrow_playlists DROP COLUMN cover_image'); console.log('Dropped cover_image from learngrow_playlists'); } catch(e) { console.error('Error dropping cover_image:', e.message); }
  process.exit(0);
}
run();
