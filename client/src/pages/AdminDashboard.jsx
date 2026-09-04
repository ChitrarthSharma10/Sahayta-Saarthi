import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  XCircle,
  BarChart3,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes] = await Promise.all([
        api.get('/admin/analytics')
      ]);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);



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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Distribution Pie Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    System Role Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rolePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
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

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium text-center">
                  Active Competency Engine monitoring live role ratios.
                </div>
              </div>
              
              {/* Extra Info / Quick Actions for Command Center */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                 <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-extrabold text-slate-900 mb-2">Welcome to the Command Center</h3>
                 <p className="text-sm text-slate-500 mb-6 px-4">
                   Here you can monitor the high-level platform health, user distribution, and completion rates. 
                   Use the sidebar navigation to manage specific administrative tasks.
                 </p>
                 <div className="flex justify-center gap-4">
                    <a href="/users" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">Manage Users</a>
                    <a href="/announcements" className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all">Post Announcements</a>
                 </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
