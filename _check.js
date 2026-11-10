const { sequelize } = require('./src/config/database');
require('dotenv').config();

(async () => {
  try {
    const [rows] = await sequelize.query("SHOW COLUMNS FROM cocktails LIKE 'cover'");
    console.log('cover column:', rows.length ? rows[0].Field : 'MISSING');
  } catch (e) {
    console.error('ERR:', e.message);
  } finally {
    await sequelize.close();
  }
})();
