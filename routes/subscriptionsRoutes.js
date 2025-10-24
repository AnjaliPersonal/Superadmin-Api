import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { listSubscriptions, createSubscription, getSubscription, updateSubscription, deleteSubscription } from '../controllers/subscriptionsController.js';

const router = express.Router();

router.get('/', protect, authorize(['admin','superadmin','user']), listSubscriptions);
router.post('/', protect, authorize(['admin','superadmin','user']), [
  body('plan').notEmpty().withMessage('plan required'),
  body('price').isNumeric().withMessage('price must be number')
], createSubscription);
router.get('/:id', protect, authorize(['admin','superadmin','user']), getSubscription);
router.put('/:id', protect, authorize(['admin','superadmin']), updateSubscription);
router.delete('/:id', protect, authorize(['admin','superadmin']), deleteSubscription);

export default router;
