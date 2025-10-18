// models/RefreshToken.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class RefreshToken extends Model {}

RefreshToken.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  token: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: true
});

export default RefreshToken;
