// Script to import users from a JSON file (exported from MongoDB Compass).
// Place `users.json` (array of user documents) at project root and run:
//    npm run migrate
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB, sequelize } from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const migrate = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    const file = path.resolve('users.json');
    if (!fs.existsSync(file)) {
      console.error('users.json not found in project root. Export from MongoDB Compass and save as users.json');
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const doc of data) {
      const email = doc.email || doc.emailAddress || (doc._doc && doc._doc.email);
      if (!email) continue;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        console.log('Skipping existing:', email);
        continue;
      }
      let password = doc.password || 'TempPass123';
      // If password looks short, re-hash
      if (!password || password.length < 20) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      }
      await User.create({
        name: doc.name || doc.fullname || 'Imported User',
        email,
        password,
        role: doc.role || 'user',
        status: doc.status || 'active'
      });
      console.log('Imported', email);
    }
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
