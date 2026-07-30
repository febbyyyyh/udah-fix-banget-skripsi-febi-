import db from './config/db.js';

(async () => {
  try {
    const category = 'depression';
    const fallbackName = '%Depression%';

    const [meditations] = await db.query(
      `SELECT ma.*, mt.name as type_name, mt.id as meditation_type_id FROM meditation_audios ma JOIN meditation_types mt ON ma.meditation_type_id = mt.id WHERE mt.category_type = ? OR mt.name LIKE ? ORDER BY ma.created_at ASC`,
      [category, fallbackName]
    );
    console.log('SIMULATED QUERY depression', JSON.stringify(meditations, null, 2));

    const [recommendedType] = await db.query(
      `SELECT id, name FROM meditation_types WHERE category_type = ? OR name LIKE ? ORDER BY created_at DESC LIMIT 1`,
      [category, fallbackName]
    );
    console.log('RECOMMENDED TYPE', JSON.stringify(recommendedType, null, 2));

    const [types] = await db.query(`SELECT id,name,category_type FROM meditation_types ORDER BY id ASC`);
    console.log('TYPES', JSON.stringify(types, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
