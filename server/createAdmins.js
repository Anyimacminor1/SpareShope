require('dotenv').config();
const db = require('./models');
const bcrypt = require('bcrypt');

const admins = [
  {
    name: 'Dr OFE CALEB CEO-SA',
    email: 'ofecaleb2@gmail.com',
    whatsapp: '651632823',
    password: 'SPARE#shpoe!@S-Admin',
    role: 'admin',
  },
  {
    name: 'Anyi Mac CEO-A',
    email: 'anyimac86@gmail.com',
    whatsapp: '650596881',
    password: 'SsRole!-leader#-Admin',
    role: 'admin',
  },
];

(async () => {
  try {
    await db.sequelize.authenticate();
    for (const admin of admins) {
      const hash = await bcrypt.hash(admin.password, 10);
      const [user, created] = await db.User.findOrCreate({
        where: { email: admin.email },
        defaults: {
          name: admin.name,
          password: hash,
          role: admin.role,
          whatsapp: admin.whatsapp,
        },
      });
      if (!created) {
        // Update info if user already exists
        user.name = admin.name;
        user.password = hash;
        user.role = admin.role;
        user.whatsapp = admin.whatsapp;
        await user.save();
        console.log(`Updated admin: ${admin.email}`);
      } else {
        console.log(`Created admin: ${admin.email}`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating admins:', err);
    process.exit(1);
  }
})(); 