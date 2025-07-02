const db = require('./models');

async function fixDatabase() {
  try {
    // Fix Orders table to allow null userId
    await db.sequelize.query('ALTER TABLE "Orders" ALTER COLUMN "userId" DROP NOT NULL;');
    console.log('Orders table updated successfully');
    
    // Fix Users table to allow null email and phone
    await db.sequelize.query('ALTER TABLE "Users" ALTER COLUMN "email" DROP NOT NULL;');
    console.log('Users table email column updated successfully');
    
    process.exit(0);
  } catch (err) {
    console.error('Error fixing database:', err);
    process.exit(1);
  }
}

fixDatabase(); 