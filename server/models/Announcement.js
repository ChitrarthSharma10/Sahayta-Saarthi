import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorName: { type: String, default: 'Capacity Admin' }
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
