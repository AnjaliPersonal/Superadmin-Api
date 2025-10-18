import express from 'express';
import { listRoles, createRole, updateRole, deleteRole, setRolePermissions } from '../controllers/rolesController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.get('/', protect, authorize(['superadmin']), listRoles);
router.post('/', protect, authorize(['superadmin']), createRole);
router.put('/:id', protect, authorize(['superadmin']), updateRole);
router.delete('/:id', protect, authorize(['superadmin']), deleteRole);
router.post('/:id/permissions', protect, authorize(['superadmin']), setRolePermissions);

export default router;
