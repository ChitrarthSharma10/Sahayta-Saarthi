import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Trainer', 'Trainee'], required: true },
    verifiedSkills: [{ type: String, trim: true }],
    targetSkills: [{ type: String, trim: true }],
    approved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
