import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { listProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/projectsController.js';

const router = express.Router();

router.get('/', protect, authorize(['admin','superadmin','user']), listProjects);
router.post('/', protect, authorize(['admin','superadmin','user']), [ body('name').notEmpty().withMessage('name required') ], createProject);
router.get('/:id', protect, authorize(['admin','superadmin','user']), getProject);
router.put('/:id', protect, authorize(['admin','superadmin','user']), updateProject);
router.delete('/:id', protect, authorize(['superadmin']), deleteProject);

export default router;
