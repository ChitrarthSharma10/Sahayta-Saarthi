import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  skillTag: { type: String, required: true, trim: true }
});

const assessmentSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, default: 15 },
    passingScore: { type: Number, default: 60 },
    questions: [questionSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);
