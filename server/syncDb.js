const db = require('./models');

async function syncDatabase() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
}

syncDatabase(); 