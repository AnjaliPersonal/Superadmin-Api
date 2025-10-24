// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB, sequelize } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import permissionsRoutes from './routes/permissionsRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import subscriptionsRoutes from './routes/subscriptionsRoutes.js';


// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic health route
app.get('/', (req, res) => res.json({ message: 'Superadmin backend (MySQL) is running' }));

// Mount routes (these use middleware that expects req.user for protected routes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

// Start up: connect DB, import models/associations, sync, then start server
const start = async () => {
  try {
    // 1) Connect to DB
    await connectDB();

    // 2) Ensure model files are imported so Sequelize knows about them.
    //    Importing the model files registers them with sequelize.
    //    The associations file registers relationships (role <-> permission).
    await import('./models/User.js');
    // optional models (these files may not exist if you haven't added them yet):
    try { await import('./models/RefreshToken.js'); } catch (e) {/* ignore if not present */}
    try { await import('./models/Role.js'); } catch (e) {/* ignore if not present */}
    try { await import('./models/Permission.js'); } catch (e) {/* ignore if not present */}

    // 3) Import associations (this sets up many-to-many etc.)
    //    associations.js should import the models and define belongsToMany / belongsTo etc.
    try {
      await import('./associations.js');
    } catch (e) {
      // If associations.js not present yet, continue — not fatal
      console.warn('associations.js not found or failed to import:', e.message);
    }

    // 4) Sync models with DB (development convenience).
    //    In production, use migrations instead of sync({ alter: true }).
    await sequelize.sync({ alter: true });
    console.log('Sequelize models synced.');

    // 5) Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
