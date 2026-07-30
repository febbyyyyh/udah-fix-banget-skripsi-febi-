import db from './config/db.js';

(async () => {
  try {
    const [result] = await db.query("UPDATE meditation_types SET category_type = 'depression' WHERE name = 'Depression Relief'");
    console.log('UPDATE RESULT', result);
    const [types] = await db.query(`SELECT id,name,category_type FROM meditation_types ORDER BY id ASC`);
    console.log('TYPES AFTER UPDATE', JSON.stringify(types, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
