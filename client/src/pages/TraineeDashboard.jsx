import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Target, UserCheck, Award, ArrowUpRight, Sparkles, CheckCircle2, XCircle, Clock, Megaphone } from 'lucide-react';

export default function TraineeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [courseRes, resultRes, annRes] = await Promise.all([
          api.get('/courses'),
          api.get('/assessments/results'),
          api.get('/announcements')
        ]);
        setCourses(courseRes.data);
        setResults(resultRes.data);
        setAnnouncements(annRes.data);
      } catch (err) {
        console.error('Error fetching trainee dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const enrolledCourses = courses.filter((c) =>
    c.enrolledTrainees?.some((tId) => (tId._id || tId) === user?._id || (tId.id || tId) === user?.id)
  );

  // Latest assigned trainer from failed result
  const latestFailedResultWithTrainer = results.find((r) => !r.passed && r.assignedTrainerId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Trainee Competency Portal" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Recommended Trainer Upskilling Card (Competency Engine Alert) */}
            {latestFailedResultWithTrainer && (
              <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                        Competency Engine Alert
                      </span>
                      <span className="text-xs font-bold text-amber-800">Upskilling Recommendation</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900">
                      Recommended Trainer Assigned for Upskilling
                    </h3>

                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                      Based on your recent assessment, a skill gap was detected in:{' '}
                      <span className="font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                        {latestFailedResultWithTrainer.failedSkillTags?.join(', ')}
                      </span>
                      . System has automatically paired you with expert instructor{' '}
                      <strong className="text-slate-900">{latestFailedResultWithTrainer.assignedTrainerId?.name}</strong>.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href={`mailto:${latestFailedResultWithTrainer.assignedTrainerId?.email}`}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        Contact Trainer ({latestFailedResultWithTrainer.assignedTrainerId?.email})
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Target Skills & Overview Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{enrolledCourses.length}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{user?.targetSkills?.length || 0}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Skill Gaps</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {results.filter((r) => r.passed).length} / {results.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments Passed</div>
                </div>
              </div>
            </div>

            {/* Active Skill Gap Tags List */}
            {user?.targetSkills && user.targetSkills.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Your Active Skill Gaps (Target Competencies)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.targetSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

            {/* My Courses Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">My Learning Courses</h3>
                  <p className="text-xs text-slate-500">Courses you are currently registered for</p>
                </div>
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                >
                  Browse Catalog <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-slate-400 text-xs">Loading course enrollments...</div>
              ) : enrolledCourses.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No active course enrollments</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Browse our course catalog to get started</p>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((c) => (
                    <div
                      key={c._id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-md uppercase">
                          {c.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-2 mb-1">{c.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          Instructor: {c.createdBy?.name || 'Trainer'}
                        </span>
                        <button
                          onClick={() => navigate(`/course/${c._id}`)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                        >
                          Access Course & Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz & Assessment History */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Assessment Performance History</h3>

              {results.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">No quiz submissions recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th className="pb-3">Assessment</th>
                        <th className="pb-3">Score</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Skill Gaps Identified</th>
                        <th className="pb-3">Assigned Trainer</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {results.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 font-bold text-slate-900">
                            {r.assessmentId?.title || 'Course Quiz'}
                          </td>
                          <td className="py-3.5">
                            <span className="font-extrabold text-sm text-slate-900">{r.scorePercentage}%</span>
                          </td>
                          <td className="py-3.5">
                            {r.passed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="py-3.5">
                            {r.failedSkillTags?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {r.failedSkillTags.map((st, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 font-semibold rounded text-[11px]">
                                    {st}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">None</span>
                            )}
                          </td>
                          <td className="py-3.5">
                            {r.assignedTrainerId ? (
                              <span className="font-bold text-amber-700">{r.assignedTrainerId.name}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3.5 text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString()}
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
    </div>
  );
}
