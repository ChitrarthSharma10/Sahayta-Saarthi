import express from 'express';
import { getAllUsers, toggleUserApproval, getPlatformAnalytics } from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, authorizeRoles('Admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/approve', toggleUserApproval);
router.get('/analytics', getPlatformAnalytics);

export default router;
