import dotenv from 'dotenv';
dotenv.config();
import { connectDB, sequelize } from '../config/db.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';

const seed = async () => {
  await connectDB();
  await sequelize.sync();

  const perms = [
    'users.read', 'users.create', 'users.update', 'users.delete',
    'projects.read', 'projects.create', 'projects.update', 'projects.delete'
  ];

  for (const p of perms) {
    await Permission.findOrCreate({ where: { name: p }, defaults: { description: p } });
  }

  const [superRole] = await Role.findOrCreate({ where: { name: 'superadmin' }, defaults: { description: 'Full access' } });
  const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' }, defaults: { description: 'Admin access' } });
  const [userRole] = await Role.findOrCreate({ where: { name: 'user' }, defaults: { description: 'Basic user' } });

  // give all perms to superadmin
  const allPerms = await Permission.findAll();
  await superRole.setPermissions(allPerms);

  // give basic read/update to admin
  const adminPerms = await Permission.findAll({ where: { name: ['users.read','users.update','projects.read','projects.update'] }});
  await adminRole.setPermissions(adminPerms);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
