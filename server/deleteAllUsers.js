require('dotenv').config();
const db = require('./models');

(async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.query('TRUNCATE "Users" CASCADE');
    console.log('All users and related data deleted (CASCADE).');
    process.exit(0);
  } catch (err) {
    console.error('Error deleting users:', err);
    process.exit(1);
  }
})(); 