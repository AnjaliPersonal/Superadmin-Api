import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Permission extends Model {}

Permission.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255), allowNull: true }
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'permissions',
  timestamps: true
});

export default Permission;
