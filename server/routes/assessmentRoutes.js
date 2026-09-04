import express from 'express';
import {
  createAssessment,
  getAssessmentById,
  getAssessmentByCourse,
  submitAssessment,
  getTraineeResults,
  getTrainerAnalytics
} from '../controllers/assessmentController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('Admin', 'Trainer'), createAssessment);
router.get('/course/:courseId', verifyToken, getAssessmentByCourse);
router.get('/results', verifyToken, getTraineeResults);
router.get('/trainer-analytics', verifyToken, authorizeRoles('Admin', 'Trainer'), getTrainerAnalytics);
router.get('/:id', verifyToken, getAssessmentById);
router.post('/submit', verifyToken, authorizeRoles('Trainee'), submitAssessment);

export default router;
