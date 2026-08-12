import express from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/:productId', getInventory);
router.put('/:productId', authenticate, authorizeRoles('ADMIN'), updateInventory);

export default router;
