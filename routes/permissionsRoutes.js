import express from 'express';
import { listPermissions, createPermission, deletePermission } from '../controllers/permissionsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.get('/', protect, authorize(['superadmin']), listPermissions);
router.post('/', protect, authorize(['superadmin']), createPermission);
router.delete('/:id', protect, authorize(['superadmin']), deletePermission);

export default router;
