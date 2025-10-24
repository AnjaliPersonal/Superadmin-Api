
import sequelize from './config/db.js';
import User from './models/User.js';
import Role from './models/Role.js';
import Permission from './models/Permission.js';
import Project from './models/Project.js';
import Subscription from './models/Subscription.js';


const safeHasMany = (Source, Target, alias, opts = {}) => {
  if (!Source.associations || !Source.associations[alias]) {
    Source.hasMany(Target, { as: alias, ...opts });
  }
};
const safeBelongsTo = (Target, Source, alias, opts = {}) => {
  if (!Target.associations || !Target.associations[alias]) {
    Target.belongsTo(Source, { as: alias, ...opts });
  }
};
const safeBelongsToMany = (A, B, through, asA, asB, optsA = {}, optsB = {}) => {
  if (!A.associations || !A.associations[asA]) {
    A.belongsToMany(B, { through, as: asA, ...optsA });
  }
  if (!B.associations || !B.associations[asB]) {
    B.belongsToMany(A, { through, as: asB, ...optsB });
  }
};


safeHasMany(User, Project, 'projects', { foreignKey: 'owner_id', onDelete: 'CASCADE' });
safeBelongsTo(Project, User, 'owner', { foreignKey: 'owner_id' });

safeHasMany(User, Subscription, 'subscriptions', { foreignKey: 'user_id', onDelete: 'CASCADE' });
safeBelongsTo(Subscription, User, 'user', { foreignKey: 'user_id' });


safeBelongsToMany(
  Role,
  Permission,
  'role_permissions',
  'permissions', 
  'roles',       
  { foreignKey: 'role_id', otherKey: 'permission_id' },
  { foreignKey: 'permission_id', otherKey: 'role_id' }
);


export { sequelize, User, Role, Permission, Project, Subscription };
export default { sequelize, User, Role, Permission, Project, Subscription };


export const initAssociations = async ({ authenticate = true, sync = false, syncOptions = {} } = {}) => {
  try {
    if (authenticate) {
      await sequelize.authenticate();
      console.log('Database connection authenticated (associations).');
    }
    if (sync) {
      await sequelize.sync(syncOptions);
      console.log('Sequelize sync completed (associations).');
    }
  } catch (err) {
    console.error(' associations.initAssociations error:', err && err.message ? err.message : err);
    throw err;
  }
};
