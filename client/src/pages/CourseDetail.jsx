import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, FileText, HelpCircle, ArrowLeft, UserCheck, Award, CheckCircle2 } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
        setAssessment(res.data.assessment);
      } catch (err) {
        console.error('Error fetching course detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm">Loading course...</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm">Course not found.</div>;
  }

  const isEnrolled = course.enrolledTrainees?.some(
    (tId) => (tId._id || tId) === user?._id || (tId.id || tId) === user?.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title={course.title} />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Catalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Video & Resources (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Embedded Video Resource */}
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex items-center justify-center border border-slate-800">
                  {course.videoUrl ? (
                    <iframe
                      src={course.videoUrl}
                      title={course.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-center p-6">
                      <PlayCircle className="w-16 h-16 text-indigo-400 mx-auto mb-2" />
                      <p className="text-white font-bold text-sm">Interactive Video Lecture</p>
                      <p className="text-xs text-slate-400 mt-1">Resource streaming ready</p>
                    </div>
                  )}
                </div>

                {/* Course Syllabus Overview */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100 uppercase">
                    {course.category}
                  </span>

                  <h1 className="text-2xl font-extrabold text-slate-900">{course.title}</h1>

                  <p className="text-slate-700 text-sm leading-relaxed">{course.description}</p>

                  {course.pdfUrl && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Learning Materials & Syllabus (PDF)</div>
                          <div className="text-[11px] text-slate-400">Download supplementary study guide</div>
                        </div>
                      </div>
                      <a
                        href={course.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Instructor & Assessment Launcher (1 Col) */}
              <div className="space-y-6">
                {/* Instructor Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Course Instructor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{course.createdBy?.name}</div>
                      <div className="text-xs text-slate-500">{course.createdBy?.email}</div>
                    </div>
                  </div>
                  {course.createdBy?.verifiedSkills && (
                    <div className="pt-2">
                      <div className="text-[11px] text-slate-400 font-semibold mb-1">Verified Domain Expertise:</div>
                      <div className="flex flex-wrap gap-1">
                        {course.createdBy.verifiedSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Assessment Launcher Card */}
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                      Competency Evaluation
                    </span>
                  </div>

                  <h3 className="text-xl font-bold">
                    {assessment ? assessment.title : 'MCQ Assessment Quiz'}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Test your mastery. Score ≥ 60% to pass. Incorrect questions will trigger the Competency Engine for targeted upskilling.
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-indigo-800/80 pt-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <strong className="text-white">{assessment?.durationMinutes || 15} Minutes</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Score:</span>
                      <strong className="text-white">{assessment?.passingScore || 60}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <strong className="text-white">{assessment?.questions?.length || 3} Questions</strong>
                    </div>
                  </div>

                  {user?.role === 'Trainee' && (
                    <button
                      onClick={() => navigate(`/assessment/${assessment?._id || course._id}`)}
                      className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Start Timed MCQ Assessment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
