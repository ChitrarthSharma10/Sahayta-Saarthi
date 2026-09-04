import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    traineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    scorePercentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    failedSkillTags: [{ type: String, trim: true }],
    assignedTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Result', resultSchema);
