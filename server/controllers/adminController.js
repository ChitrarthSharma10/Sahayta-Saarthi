import User from '../models/User.js';
import Course from '../models/Course.js';
import Result from '../models/Result.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const toggleUserApproval = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.approved = !user.approved;
    await user.save();

    res.json({ message: `User approval set to ${user.approved}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user approval', error: error.message });
  }
};

export const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'Admin' });
    const trainerCount = await User.countDocuments({ role: 'Trainer' });
    const traineeCount = await User.countDocuments({ role: 'Trainee' });
    const pendingApprovalCount = await User.countDocuments({ approved: false });

    const totalCourses = await Course.countDocuments();
    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ passed: true });

    const completionRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 100;

    // Active skill gaps across trainees
    const trainees = await User.find({ role: 'Trainee' });
    const activeSkillGapsSet = new Set();
    trainees.forEach(t => {
      if (t.targetSkills && t.targetSkills.length > 0) {
        t.targetSkills.forEach(s => activeSkillGapsSet.add(s));
      }
    });

    res.json({
      totalUsers,
      roleBreakdown: {
        Admin: adminCount,
        Trainer: trainerCount,
        Trainee: traineeCount
      },
      pendingApprovals: pendingApprovalCount,
      totalCourses,
      totalAssessmentsTaken: totalResults,
      courseCompletionRate: completionRate,
      activeSkillGapsCount: activeSkillGapsSet.size,
      activeSkillGapsList: Array.from(activeSkillGapsSet)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform analytics', error: error.message });
  }
};
