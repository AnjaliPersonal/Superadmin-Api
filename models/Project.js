// models/Project.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Project extends Model {}

Project.init({
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  owner_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('active','inactive'), allowNull: false, defaultValue: 'active' }
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  underscored: true,
  timestamps: true
});

export default Project;
