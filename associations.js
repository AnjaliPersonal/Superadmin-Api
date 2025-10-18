import User from './models/User.js';
import Role from './models/Role.js';
import Permission from './models/Permission.js';

// Role <-> Permission (many-to-many)
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'roleId',
  otherKey: 'permissionId'
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permissionId',
  otherKey: 'roleId'
});

// (Optional) link User to Role if you want later (currently User.role is a string)
export { User, Role, Permission };
