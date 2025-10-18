import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Role extends Model {}

Role.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255), allowNull: true }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: true
});

export default Role;
