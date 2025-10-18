// routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// List all users — requires users.read permission
router.get('/', protect, checkPermission('users.read'), getUsers);

// Get single user by id — requires users.read permission
router.get('/:id', protect, checkPermission('users.read'), getUserById);

// Update user — requires users.update permission
router.put('/:id', protect, checkPermission('users.update'), updateUser);

// Delete user — requires users.delete permission
router.delete('/:id', protect, checkPermission('users.delete'), deleteUser);

export default router;
