require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);

// Associations
// User has many Orders
// Order belongs to User
// Order has many OrderItems
// OrderItem belongs to Order
// Product has many OrderItems
// OrderItem belongs to Product
db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });
db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });
db.Product.hasMany(db.OrderItem, { foreignKey: 'productId' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId' });

// NOTE: If you add new fields (e.g., whatsapp), make sure to run a migration or sync to update the database schema.

const ContactInfo = sequelize.define('ContactInfo', {
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  hours: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: false,
});

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
  identifier: { type: DataTypes.STRING, allowNull: false }, // email or phone
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  timestamps: true,
});

const ContactMessage = sequelize.define('ContactMessage', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, reviewed, responded
}, {
  timestamps: true,
});

module.exports = {
  ...db,
  ContactInfo,
  ForgotPasswordRequest,
  ContactMessage,
}; 