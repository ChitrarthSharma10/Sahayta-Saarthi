import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Layers, ShieldCheck, UserCheck, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Trainee');
  const [verifiedSkills, setVerifiedSkills] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        const skillsArr = verifiedSkills.split(',').map(s => s.trim()).filter(Boolean);
        const user = await register({ name, email, password, role, verifiedSkills: skillsArr });
        redirectUser(user.role);
      } else {
        const user = await login(email, password);
        redirectUser(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setError('');
    setSubmitting(true);
    try {
      const user = await demoLogin(demoRole);
      redirectUser(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const redirectUser = (userRole) => {
    if (userRole === 'Admin') navigate('/admin');
    else if (userRole === 'Trainer') navigate('/trainer');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          CAPACITY<span className="text-indigo-400">CONNECT</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          Enterprise Competency Engine & Adaptive Upskilling Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Quick Demo Login Box */}
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700/80 rounded-2xl p-4 shadow-xl mb-6">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Instant 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('Admin')}
              className="px-3 py-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/80 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => handleQuickDemo('Trainer')}
              className="px-3 py-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Trainer</span>
            </button>

            <button
              onClick={() => handleQuickDemo('Trainee')}
              className="px-3 py-2 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/80 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Trainee</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register New User
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  >
                    <option value="Trainee">Trainee (Learner Profile)</option>
                    <option value="Trainer">Trainer (Instructor Profile - Needs Admin Approval)</option>
                    <option value="Admin">Admin (System Manager)</option>
                  </select>
                </div>

                {role === 'Trainer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Verified Skill Tags (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={verifiedSkills}
                      onChange={(e) => setVerifiedSkills(e.target.value)}
                      placeholder="e.g. Node.js, React, Docker, Kubernetes"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-6"
            >
              <span>{submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
