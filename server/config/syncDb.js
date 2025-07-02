const db = require('../models');

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    process.exit();
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
    process.exit(1);
  }); 