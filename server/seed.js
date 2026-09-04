import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Course from './models/Course.js';
import Assessment from './models/Assessment.js';
import Announcement from './models/Announcement.js';

export const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already populated. Skipping seed.');
      return;
    }

    console.log('Seeding initial demonstration data...');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const trainerPassword = await bcrypt.hash('trainer123', salt);
    const traineePassword = await bcrypt.hash('trainee123', salt);

    // 1. Create Users
    const admin = await User.create({
      name: 'Eleanor Vance (Chief Admin)',
      email: 'admin@capacity.com',
      password: adminPassword,
      role: 'Admin',
      verifiedSkills: ['Governance', 'System Security'],
      targetSkills: [],
      approved: true
    });

    const trainer1 = await User.create({
      name: 'Dr. John Smith',
      email: 'trainer.john@capacity.com',
      password: trainerPassword,
      role: 'Trainer',
      verifiedSkills: ['React', 'Node.js', 'State Management', 'Express Routing'],
      targetSkills: [],
      approved: true
    });

    const trainer2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'trainer.sarah@capacity.com',
      password: trainerPassword,
      role: 'Trainer',
      verifiedSkills: ['Cloud Computing', 'Docker', 'Kubernetes', 'DevOps'],
      targetSkills: [],
      approved: true
    });

    const trainee1 = await User.create({
      name: 'Alex Rivera',
      email: 'trainee.alex@capacity.com',
      password: traineePassword,
      role: 'Trainee',
      verifiedSkills: [],
      targetSkills: ['Node.js'],
      approved: true
    });

    const trainee2 = await User.create({
      name: 'Maria Chen',
      email: 'trainee.maria@capacity.com',
      password: traineePassword,
      role: 'Trainee',
      verifiedSkills: [],
      targetSkills: [],
      approved: true
    });

    const trainee3 = await User.create({
      name: 'Sam Taylor',
      email: 'trainee.sam@capacity.com',
      password: traineePassword,
      role: 'Trainee',
      verifiedSkills: [],
      targetSkills: [],
      approved: false // Set 1 trainee to pending to demonstrate Admin approval workflow!
    });

    // 2. Create Courses
    const course1 = await Course.create({
      title: 'Full-Stack Node.js & Express Architecture',
      description: 'Master backend API design, Express middleware pipelines, state management, and asynchronous event handling for enterprise microservices.',
      category: 'Web Development',
      videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      createdBy: trainer1._id,
      enrolledTrainees: [trainee1._id, trainee2._id]
    });

    const course2 = await Course.create({
      title: 'Enterprise Cloud Infrastructure & Docker Fundamentals',
      description: 'Learn containerization, Docker network bridging, cloud deployment pipelines, and Kubernetes orchestrations.',
      category: 'DevOps & Cloud',
      videoUrl: 'https://www.youtube.com/embed/gAkwW2tuIqE',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      createdBy: trainer2._id,
      enrolledTrainees: [trainee1._id]
    });

    const course3 = await Course.create({
      title: 'Full-Stack & Cloud Competency Benchmark (5-Q Demo)',
      description: 'Interactive 5-question diagnostic evaluation specifically designed to demonstrate real-time competency mapping, weak skill tag extraction, and automatic trainer assignment.',
      category: 'Diagnostic Evaluation',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      createdBy: trainer1._id,
      enrolledTrainees: [trainee1._id, trainee2._id]
    });

    // 3. Create Assessments
    await Assessment.create({
      courseId: course3._id,
      title: 'Full-Stack & Cloud Competency Benchmark (5-Question Demo Quiz)',
      durationMinutes: 10,
      passingScore: 60,
      questions: [
        {
          questionText: '1. [Skill Tag: Node.js] Which Node.js architecture model allows handling thousands of concurrent connections with a single thread?',
          options: [
            'Multi-threaded blocking I/O model',
            'Non-blocking Event Loop architecture',
            'Synchronous process allocation',
            'Thread-per-request model'
          ],
          correctOptionIndex: 1,
          skillTag: 'Node.js'
        },
        {
          questionText: '2. [Skill Tag: Express Routing] How does Express middleware pass execution control to the next handler in the stack?',
          options: [
            'By calling the next() function',
            'By returning a boolean true',
            'By triggering a process.exit() event',
            'By executing res.send()'
          ],
          correctOptionIndex: 0,
          skillTag: 'Express Routing'
        },
        {
          questionText: '3. [Skill Tag: React] In modern React component architecture, which hook is used to handle side-effects like fetching data?',
          options: [
            'useState',
            'useContext',
            'useEffect',
            'useReducer'
          ],
          correctOptionIndex: 2,
          skillTag: 'React'
        },
        {
          questionText: '4. [Skill Tag: Docker] What is the primary function of a Dockerfile in containerized application development?',
          options: [
            'To host a production database cluster',
            'To define step-by-step instructions for building a reproducible container image',
            'To manage domain name server records',
            'To encrypt user passwords'
          ],
          correctOptionIndex: 1,
          skillTag: 'Docker'
        },
        {
          questionText: '5. [Skill Tag: Kubernetes] Which Kubernetes resource unit manages auto-scaling and rolling deployments of pod replicas?',
          options: [
            'Kubelet',
            'Ingress Controller',
            'Deployment',
            'ConfigMap'
          ],
          correctOptionIndex: 2,
          skillTag: 'Kubernetes'
        }
      ]
    });

    await Assessment.create({
      courseId: course1._id,
      title: 'Node.js & Express Competency Evaluation',
      durationMinutes: 10,
      passingScore: 60,
      questions: [
        {
          questionText: 'What is the primary role of the Express next() function in middleware chaining?',
          options: [
            'It terminates the HTTP request cycle immediately.',
            'It passes control to the next matching middleware function in the stack.',
            'It serializes JSON data for database persistence.',
            'It creates a new worker thread in the event loop.'
          ],
          correctOptionIndex: 1,
          skillTag: 'Express Routing'
        },
        {
          questionText: 'Which Node.js core module is responsible for managing non-blocking asynchronous file I/O?',
          options: [
            'http',
            'events',
            'fs (Promises/Callback API)',
            'cluster'
          ],
          correctOptionIndex: 2,
          skillTag: 'Node.js'
        },
        {
          questionText: 'When managing application state in distributed Express services, which pattern prevents state mutation bugs?',
          options: [
            'Global mutable singleton variables',
            'Immutable data structures and stateless controllers',
            'Shared disk file writes',
            'Hardcoded session state'
          ],
          correctOptionIndex: 1,
          skillTag: 'State Management'
        }
      ]
    });

    await Assessment.create({
      courseId: course2._id,
      title: 'Docker & Containerization Benchmark',
      durationMinutes: 10,
      passingScore: 60,
      questions: [
        {
          questionText: 'Which Docker command isolates lightweight image layers to build deterministic container runtime environments?',
          options: [
            'docker build -t container_name .',
            'docker run -d -p 80:80 image_name',
            'docker exec -it container_id bash',
            'docker compose down'
          ],
          correctOptionIndex: 0,
          skillTag: 'Docker'
        },
        {
          questionText: 'What cloud computing pillar guarantees zero-downtime rolling updates across container nodes?',
          options: [
            'Vertical CPU scaling',
            'High Availability Orchestration (Kubernetes deployment updates)',
            'Static IP binding',
            'Manual server restarts'
          ],
          correctOptionIndex: 1,
          skillTag: 'Cloud Computing'
        },
        {
          questionText: 'In Kubernetes cluster architecture, which component maintains container desired state across pods?',
          options: [
            'Kube-proxy',
            'Kubelet engine',
            'Control Plane (Kube-Controller-Manager)',
            'Container Registry'
          ],
          correctOptionIndex: 2,
          skillTag: 'Kubernetes'
        }
      ]
    });

    // 4. Create Announcements
    await Announcement.create({
      title: '🚀 Capacity Connect Platform 2.0 Live!',
      content: 'Welcome to our organization-wide competency mapping portal. Trainees can now enroll in courses, take adaptive assessments, and instantly get assigned certified trainers for target skill gaps.',
      authorName: 'Eleanor Vance (Chief Admin)'
    });

    await Announcement.create({
      title: '📌 Q3 Technical Skill Certification Drive Initiated',
      content: 'All engineering trainees are requested to complete the Node.js and Docker assessments by the end of the month to update competency profiles.',
      authorName: 'Eleanor Vance (Chief Admin)'
    });

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
