import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Megaphone,
  BarChart3,
  Sparkles,
  TrendingUp,
  Send,
  UserCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [usersRes, analyticsRes, annRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/analytics'),
        api.get('/announcements')
      ]);
      setUsersList(usersRes.data);
      setAnalytics(analyticsRes.data);
      setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleApproval = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating approval status');
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    setPublishing(true);
    try {
      await api.post('/announcements', { title: annTitle, content: annContent });
      setAnnTitle('');
      setAnnContent('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing announcement');
    } finally {
      setPublishing(false);
    }
  };

  const rolePieData = analytics?.roleBreakdown
    ? [
        { name: 'Admins', value: analytics.roleBreakdown.Admin || 1, color: '#8b5cf6' },
        { name: 'Trainers', value: analytics.roleBreakdown.Trainer || 2, color: '#10b981' },
        { name: 'Trainees', value: analytics.roleBreakdown.Trainee || 3, color: '#3b82f6' }
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Admin Command Center" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{analytics?.totalUsers || 0}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Total Users</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{analytics?.courseCompletionRate || 100}%</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Completion Pass Rate</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{analytics?.activeSkillGapsCount || 0}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Active Skill Gaps</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{analytics?.pendingApprovals || 0}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Pending Approvals</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Approval & Roster Dashboard (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">User Approvals & Account Roster</h3>
                    <p className="text-xs text-slate-500">
                      Toggle approval switch to grant platform access to pending accounts
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Skills</th>
                        <th className="pb-3">Approval Status</th>
                        <th className="pb-3">Action Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {usersList.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50">
                          <td className="py-3">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                u.role === 'Admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'Trainer'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-[11px] text-slate-600">
                            {u.verifiedSkills?.join(', ') || u.targetSkills?.join(', ') || '-'}
                          </td>
                          <td className="py-3">
                            {u.approved ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                <CheckCircle className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                                <XCircle className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleApproval(u._id)}
                              className={`px-3 py-1 text-[11px] font-bold rounded-xl transition-all shadow-xs ${
                                u.approved
                                  ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {u.approved ? 'Revoke Access' : 'Approve User'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Role Distribution Pie Chart (1 Col) */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    System Role Distribution
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rolePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {rolePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  Active Competency Engine monitoring live role ratios.
                </div>
              </div>
            </div>

            {/* Homepage Announcement Publisher Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Publisher Form (1 Col) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-indigo-600" />
                  Publish Announcement
                </h3>

                <form onSubmit={handlePublishAnnouncement} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="e.g. Platform Maintenance Notice"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Announcement Body</label>
                    <textarea
                      required
                      rows={4}
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Details for all organization members..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={publishing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{publishing ? 'Publishing...' : 'Publish Feed Item'}</span>
                  </button>
                </form>
              </div>

              {/* Feed List (2 Cols) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Live Organization Broadcast Feed
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
