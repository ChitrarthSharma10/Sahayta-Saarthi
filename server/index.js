import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Capacity Connect API server is running smoothly.' });
});

// Database connection logic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacity_connect';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB local instance successfully.');
    await seedDatabase();
  } catch (error) {
    console.warn('Local MongoDB connection attempt finished. Starting Mongo Memory Server fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to In-Memory Mongo Database!');
      await seedDatabase();
    } catch (memError) {
      console.error('In-Memory Mongo start error:', memError.message);
    }
  }
};

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 CAPACITY CONNECT SERVER RUNNING ON PORT ${PORT}`);
  console.log(`==================================================`);
});

connectDB();
