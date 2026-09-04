import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      authorName: req.user.name || 'Capacity Admin'
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error publishing announcement', error: error.message });
  }
};
