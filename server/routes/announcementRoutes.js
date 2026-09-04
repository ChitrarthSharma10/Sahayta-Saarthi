import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAnnouncements);
router.post('/', verifyToken, authorizeRoles('Admin'), createAnnouncement);

export default router;
