import mongoose from 'mongoose';
import Assessment from '../models/Assessment.js';
import Result from '../models/Result.js';
import User from '../models/User.js';

export const createAssessment = async (req, res) => {
  try {
    const { courseId, title, durationMinutes, passingScore, questions } = req.body;
    
    if (!courseId || !title || !questions || !questions.length) {
      return res.status(400).json({ message: 'Course ID, title, and at least one question are required.' });
    }

    const existingAssessment = await Assessment.findOne({ courseId });
    if (existingAssessment) {
      existingAssessment.title = title;
      existingAssessment.durationMinutes = durationMinutes || 15;
      existingAssessment.passingScore = passingScore || 60;
      existingAssessment.questions = questions;
      await existingAssessment.save();
      return res.json(existingAssessment);
    }

    const assessment = await Assessment.create({
      courseId,
      title,
      durationMinutes: durationMinutes || 15,
      passingScore: passingScore || 60,
      questions
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment', error: error.message });
  }
};

export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    let assessment = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      assessment = await Assessment.findById(id);
      if (!assessment) {
        assessment = await Assessment.findOne({ courseId: id });
      }
    }
    if (!assessment) {
      return res.status(404).json({ message: 'No assessment found.' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment', error: error.message });
  }
};

export const getAssessmentByCourse = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ courseId: req.params.courseId });
    if (!assessment) {
      return res.status(404).json({ message: 'No assessment found for this course.' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment', error: error.message });
  }
};

/**
 * STRATEGIC DIFFERENTIATOR: Competency Mapping Engine
 */
export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers } = req.body; // answers: { questionIndex: selectedOptionIndex }
    const traineeId = req.user._id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found.' });
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;
    const failedSkillTagsSet = new Set();

    assessment.questions.forEach((q, idx) => {
      const selectedOption = answers[idx];
      if (selectedOption !== undefined && Number(selectedOption) === q.correctOptionIndex) {
        correctCount++;
      } else {
        if (q.skillTag) {
          failedSkillTagsSet.add(q.skillTag.trim());
        }
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= assessment.passingScore;
    const failedSkillTags = Array.from(failedSkillTagsSet);

    let assignedTrainer = null;

    if (!passed && failedSkillTags.length > 0) {
      // 1. Add weak skill tags into Trainee's targetSkills array
      const trainee = await User.findById(traineeId);
      if (trainee) {
        const updatedTargetSkills = Array.from(new Set([...(trainee.targetSkills || []), ...failedSkillTags]));
        trainee.targetSkills = updatedTargetSkills;
        await trainee.save();
      }

      // 2. Query MongoDB for an approved Trainer whose verifiedSkills array matches weak skillTags
      const matchingTrainers = await User.find({
        role: 'Trainer',
        approved: true,
        verifiedSkills: { $in: failedSkillTags }
      });

      if (matchingTrainers && matchingTrainers.length > 0) {
        // Assign the best matching trainer (or first matched)
        assignedTrainer = matchingTrainers[0];
      }
    }

    // 3. Save Result record
    const result = await Result.create({
      traineeId,
      assessmentId,
      scorePercentage,
      passed,
      failedSkillTags,
      assignedTrainerId: assignedTrainer ? assignedTrainer._id : null
    });

    const populatedResult = await Result.findById(result._id)
      .populate('assessmentId', 'title passingScore')
      .populate('assignedTrainerId', 'name email verifiedSkills');

    res.status(201).json({
      message: passed ? 'Assessment Passed Successfully!' : 'Assessment Completed. Skill Gap Identified.',
      result: populatedResult,
      scorePercentage,
      passed,
      failedSkillTags,
      assignedTrainer: assignedTrainer ? {
        id: assignedTrainer._id,
        name: assignedTrainer.name,
        email: assignedTrainer.email,
        verifiedSkills: assignedTrainer.verifiedSkills
      } : null,
      recommendationNotice: (!passed && assignedTrainer)
        ? `Recommended Trainer ${assignedTrainer.name} assigned for upskilling in ${failedSkillTags.join(', ')}`
        : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assessment', error: error.message });
  }
};

export const getTraineeResults = async (req, res) => {
  try {
    const traineeId = req.user.role === 'Trainee' ? req.user._id : req.query.traineeId || req.user._id;
    const results = await Result.find({ traineeId })
      .populate('assessmentId', 'title courseId')
      .populate('assignedTrainerId', 'name email verifiedSkills')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

export const getTrainerAnalytics = async (req, res) => {
  try {
    const trainerId = req.user._id;
    // Find all results where this trainer is assigned or courses created by trainer
    const assignedResults = await Result.find({ assignedTrainerId: trainerId })
      .populate('traineeId', 'name email targetSkills')
      .populate('assessmentId', 'title');

    const allResults = await Result.find()
      .populate('traineeId', 'name email targetSkills')
      .populate('assessmentId', 'title');

    res.json({
      assignedStudents: assignedResults,
      totalAssessmentsTaken: allResults.length,
      averageScore: allResults.length ? Math.round(allResults.reduce((acc, curr) => acc + curr.scorePercentage, 0) / allResults.length) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer analytics', error: error.message });
  }
};
