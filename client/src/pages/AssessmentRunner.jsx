import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { Clock, CheckCircle2, XCircle, UserCheck, AlertTriangle, ArrowRight, Award, Sparkles } from 'lucide-react';

export default function AssessmentRunner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        let quizData = null;
        try {
          const res = await api.get(`/assessments/${id}`);
          quizData = res.data;
        } catch {
          try {
            const res = await api.get(`/assessments/course/${id}`);
            quizData = res.data;
          } catch {
            const res = await api.get(`/courses/${id}`);
            quizData = res.data.assessment;
          }
        }

        if (quizData) {
          setAssessment(quizData);
          setTimeLeftSeconds((quizData.durationMinutes || 15) * 60);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id]);

  // Timed quiz countdown timer & auto-submission
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0 || !assessment) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, isSubmitted, assessment]);

  const handleOptionSelect = (qIdx, optionIdx) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [qIdx]: optionIdx });
  };

  const handleAutoSubmit = () => {
    if (!isSubmitted) {
      submitQuiz();
    }
  };

  const submitQuiz = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitted || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.post('/assessments/submit', {
        assessmentId: assessment._id,
        answers
      });
      setSubmissionResult(res.data);
      setIsSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm">Loading quiz interface...</div>;
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <p className="text-sm font-semibold text-slate-700">No active assessment found for this module.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title={`MCQ Quiz: ${assessment.title}`} />

          <main className="p-6 max-w-4xl w-full mx-auto space-y-6">
            {!isSubmitted ? (
              /* Quiz Taking Interface */
              <div className="space-y-6">
                {/* Timer Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between sticky top-20 z-10">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{assessment.title}</h3>
                    <p className="text-xs text-slate-500">
                      Answer all questions. Target score: ≥ {assessment.passingScore}%
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold font-mono border ${
                      timeLeftSeconds < 120
                        ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>TIMER: {formatTime(timeLeftSeconds)}</span>
                  </div>
                </div>

                <form onSubmit={submitQuiz} className="space-y-6">
                  {assessment.questions.map((q, qIndex) => (
                    <div
                      key={q._id || qIndex}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-md">
                          Question {qIndex + 1} of {assessment.questions.length}
                        </span>
                        {q.skillTag && (
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            Tag: {q.skillTag}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">{q.questionText}</h4>

                      <div className="space-y-2">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = answers[qIndex] === oIndex;
                          return (
                            <div
                              key={oIndex}
                              onClick={() => handleOptionSelect(qIndex, oIndex)}
                              className={`p-4 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                                  : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-slate-300 text-slate-500'
                                }`}
                              >
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>{submitting ? 'Evaluating Competency...' : 'Submit Assessment Answers'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Score Summary & Competency Engine Screen */
              <div className="space-y-6">
                {/* Result Header Banner */}
                <div
                  className={`p-8 rounded-3xl text-white shadow-xl text-center relative overflow-hidden ${
                    submissionResult?.passed
                      ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800'
                      : 'bg-gradient-to-br from-rose-600 via-rose-700 to-slate-900'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center mb-3">
                    {submissionResult?.passed ? (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    ) : (
                      <XCircle className="w-10 h-10 text-white" />
                    )}
                  </div>

                  <h2 className="text-3xl font-black">
                    {submissionResult?.passed ? 'Assessment Passed!' : 'Assessment Completed - Skill Gap Detected'}
                  </h2>

                  <div className="mt-4 text-5xl font-black tracking-tight">{submissionResult?.scorePercentage}%</div>

                  <p className="mt-2 text-xs font-semibold text-white/80">
                    Passing Criteria: ≥ {assessment.passingScore}%
                  </p>
                </div>

                {/* Strategic Differentiator: Step-by-Step Competency Mapping Engine Demo Visualizer */}
                <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 shadow-lg space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          Competency Mapping Engine — Execution Pipeline
                        </h3>
                        <p className="text-xs text-slate-500">
                          Live demonstration of backend controller logic triggered on quiz submission
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-100 uppercase tracking-wider">
                      5-Step Node.js Logic
                    </span>
                  </div>

                  {/* Step-by-step visual pipeline */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                    {/* Step 1 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-600 uppercase text-[10px]">Step 1: Evaluation</div>
                      <div className="font-extrabold text-slate-800">Score & Grade</div>
                      <div className="text-[11px] text-slate-500">
                        Score calculated as <strong className="text-slate-800">{submissionResult?.scorePercentage}%</strong> vs passing score ({assessment.passingScore}%).
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
                      <div className="font-bold text-rose-600 uppercase text-[10px]">Step 2: Extraction</div>
                      <div className="font-extrabold text-slate-800">Isolate Skill Tags</div>
                      <div className="text-[11px] text-slate-600">
                        Extracted weak tags:{' '}
                        <strong className="text-rose-700">
                          {submissionResult?.failedSkillTags?.length > 0
                            ? submissionResult.failedSkillTags.join(', ')
                            : 'None (Passed)'}
                        </strong>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                      <div className="font-bold text-amber-600 uppercase text-[10px]">Step 3: DB Update</div>
                      <div className="font-extrabold text-slate-800">Target Skills Saved</div>
                      <div className="text-[11px] text-slate-600">
                        Appended weak tags to Trainee <code className="bg-amber-100 px-1 rounded">targetSkills</code> array.
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                      <div className="font-bold text-emerald-600 uppercase text-[10px]">Step 4: Mongo Query</div>
                      <div className="font-extrabold text-slate-800">Trainer Matched</div>
                      <div className="text-[11px] text-slate-600">
                        Queried Trainer matching <code className="bg-emerald-100 px-1 rounded">$in: failedSkillTags</code>.
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-700 uppercase text-[10px]">Step 5: Assignment</div>
                      <div className="font-extrabold text-slate-800">Upskilling Card</div>
                      <div className="text-[11px] text-indigo-900 font-semibold">
                        Assigned {submissionResult?.assignedTrainer?.name || 'Instructor'} to Result record.
                      </div>
                    </div>
                  </div>

                  {/* Active Result Notice & Assigned Trainer Highlight */}
                  {!submissionResult?.passed ? (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-amber-600" />
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Recommended Trainer Assigned for Upskilling
                        </h4>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        Notice triggered by Competency Engine:{' '}
                        <strong className="text-amber-900 font-bold">{submissionResult?.recommendationNotice}</strong>
                      </p>

                      {submissionResult?.assignedTrainer && (
                        <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Matched Instructor: {submissionResult.assignedTrainer.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Verified Domain Skills: {submissionResult.assignedTrainer.verifiedSkills?.join(', ')}
                            </div>
                          </div>

                          <a
                            href={`mailto:${submissionResult.assignedTrainer.email}`}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
                          >
                            Email Trainer ({submissionResult.assignedTrainer.email})
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Congratulations! You met all competency targets for this module. No skill gaps identified.</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md text-center"
                  >
                    Return to Trainee Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-2xl shadow-xs text-center"
                  >
                    Browse More Courses
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
