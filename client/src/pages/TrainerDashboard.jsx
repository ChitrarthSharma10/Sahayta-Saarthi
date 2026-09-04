import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  BookOpen,
  HelpCircle,
  Users,
  BarChart2,
  CheckCircle,
  Sparkles,
  X,
  FileText,
  Video,
  Megaphone
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // New Course Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // New Quiz Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      skillTag: ''
    }
  ]);

  const fetchTrainerData = async () => {
    try {
      const [coursesRes, analyticsRes, annRes] = await Promise.all([
        api.get('/courses'),
        api.get('/assessments/trainer-analytics'),
        api.get('/announcements')
      ]);
      setCourses(coursesRes.data);
      setAnalytics(analyticsRes.data);
      setAnnouncements(annRes.data);
      if (coursesRes.data.length > 0) {
        setSelectedCourseId(coursesRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching trainer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', { title, description, category, videoUrl, pdfUrl });
      setShowCourseModal(false);
      setTitle('');
      setDescription('');
      fetchTrainerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, skillTag: '' }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assessments', {
        courseId: selectedCourseId,
        title: quizTitle,
        durationMinutes: Number(durationMinutes),
        passingScore: Number(passingScore),
        questions
      });
      setShowQuizModal(false);
      setQuizTitle('');
      fetchTrainerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating assessment');
    }
  };

  // Prepare Recharts Data
  const chartData = [
    { name: 'Average Score', value: analytics?.averageScore || 75, fill: '#6366f1' },
    { name: 'Total Submissions', value: analytics?.totalAssessmentsTaken || 10, fill: '#10b981' },
    { name: 'Assigned Upskilling Students', value: analytics?.assignedStudents?.length || 2, fill: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Trainer Portal & Skill Management" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Welcome, {user?.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified Skills:{' '}
                  <span className="font-bold text-slate-800">
                    {user?.verifiedSkills?.join(', ') || 'Node.js, React'}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCourseModal(true)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Course
                </button>

                <button
                  onClick={() => setShowQuizModal(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  Create MCQ Quiz
                </button>
              </div>
            </div>

            {/* Announcements Feed */}
            {announcements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-indigo-600" />
                  Organization Announcements
                </h3>
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-extrabold text-slate-900 text-sm">{ann.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                      <div className="mt-2 text-[10px] font-bold text-indigo-600">By {ann.authorName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics & Distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analytics Summary */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Performance Metrics
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">Average Quiz Score</div>
                  <div className="text-3xl font-black text-indigo-600 mt-1">
                    {analytics?.averageScore || 0}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">Assigned Upskilling Trainees</div>
                  <div className="text-3xl font-black text-amber-600 mt-1">
                    {analytics?.assignedStudents?.length || 0}
                  </div>
                </div>
              </div>

              {/* Visual Score Distribution Chart (Recharts) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                  Assessment Score Distribution & Engagement
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Assigned Skill-Gap Students Roster */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Assigned Skill-Gap Students (Competency Engine Auto-Matches)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trainees who failed assessments matching your verified skills ({user?.verifiedSkills?.join(', ')})
                  </p>
                </div>
              </div>

              {!analytics?.assignedStudents || analytics.assignedStudents.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No trainees currently assigned for skill remediation under your domain.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th className="pb-3">Trainee Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Target Skill Gaps</th>
                        <th className="pb-3">Score %</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {analytics.assignedStudents.map((resItem) => (
                        <tr key={resItem._id} className="hover:bg-slate-50">
                          <td className="py-3 font-bold text-slate-900">{resItem.traineeId?.name}</td>
                          <td className="py-3 text-slate-500">{resItem.traineeId?.email}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {resItem.failedSkillTags?.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 font-extrabold text-rose-600">{resItem.scorePercentage}%</td>
                          <td className="py-3">
                            <a
                              href={`mailto:${resItem.traineeId?.email}`}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold inline-block"
                            >
                              Reach Out
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Training Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Microservices Architecture"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Web Development, DevOps"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of learning outcomes..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Embedded Video URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PDF Syllabus / Material URL</label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE QUIZ MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create MCQ Assessment</h3>
              <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Node.js Middleware Quiz"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Timer (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase mb-3">Questions & Skill Tags</h4>

                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-600">Question #{qIndex + 1}</span>
                      <input
                        type="text"
                        required
                        value={q.skillTag}
                        onChange={(e) => handleQuestionChange(qIndex, 'skillTag', e.target.value)}
                        placeholder="Skill Tag (e.g. Node.js)"
                        className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      placeholder="Enter question text..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                    />

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Options (Click badge to set Correct Answer):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIndex) => {
                          const isCorrect = q.correctOptionIndex === oIndex;
                          return (
                            <div
                              key={oIndex}
                              className={`p-2 rounded-xl border transition-all space-y-1.5 ${
                                isCorrect
                                  ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">
                                  Option {String.fromCharCode(65 + oIndex)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 text-white" />
                                      <span>Correct Answer</span>
                                    </>
                                  ) : (
                                    <span>Mark as Correct</span>
                                  )}
                                </button>
                              </div>
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                placeholder={`Enter option ${oIndex + 1} text...`}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-600"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
                >
                  + Add Another Question
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save & Attach Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
