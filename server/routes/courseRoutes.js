import express from 'express';
import { getAllCourses, getCourseById, createCourse, enrollInCourse } from '../controllers/courseController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllCourses);
router.get('/:id', verifyToken, getCourseById);
router.post('/', verifyToken, authorizeRoles('Admin', 'Trainer'), createCourse);
router.post('/:id/enroll', verifyToken, authorizeRoles('Trainee'), enrollInCourse);

export default router;
