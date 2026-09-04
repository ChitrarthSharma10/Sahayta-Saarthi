import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const usersRes = await api.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleApproval = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating approval status');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="User Approvals & Roster" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Admin Roster Dashboard (2 Cols) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Admin Accounts</h3>
                  <p className="text-xs text-slate-500">
                    Manage administrator accounts
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
                    {usersList.filter(u => u.role === 'Admin').map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800`}
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

            {/* Regular User Approval & Roster Dashboard (2 Cols) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
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
                    {usersList.filter(u => u.role !== 'Admin').map((u) => (
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
          </main>
        </div>
      </div>
    </div>
  );
}
