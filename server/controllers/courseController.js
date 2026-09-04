import Course from '../models/Course.js';
import Assessment from '../models/Assessment.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email verifiedSkills')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email verifiedSkills')
      .populate('enrolledTrainees', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assessment = await Assessment.findOne({ courseId: course._id });

    res.json({
      course,
      assessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, videoUrl, pdfUrl } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newCourse = await Course.create({
      title,
      description,
      category: category || 'General',
      videoUrl: videoUrl || '',
      pdfUrl: pdfUrl || '',
      createdBy: req.user._id,
      enrolledTrainees: []
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const traineeId = req.user._id;
    if (!course.enrolledTrainees.includes(traineeId)) {
      course.enrolledTrainees.push(traineeId);
      await course.save();
    }

    res.json({ message: 'Successfully enrolled in course', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};
