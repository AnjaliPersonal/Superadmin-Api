// models/Subscription.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Subscription extends Model {}

Subscription.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  plan: { type: DataTypes.STRING(128), allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
  starts_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  ends_at: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.ENUM('active','cancelled','expired'), allowNull: false, defaultValue: 'active' }
}, {
  sequelize,
  modelName: 'Subscription',
  tableName: 'subscriptions',
  underscored: true,
  timestamps: true
});

export default Subscription;
