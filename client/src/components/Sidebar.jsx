import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Megaphone,
  BarChart3,
  LogOut,
  Target,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const role = user?.role;

  const traineeLinks = [
    { to: '/dashboard', label: 'My Learning Portal', icon: LayoutDashboard },
    { to: '/catalog', label: 'Course Catalog', icon: BookOpen },
    { to: '/results', label: 'Skill Gap & Results', icon: Target }
  ];

  const trainerLinks = [
    { to: '/trainer', label: 'Trainer Dashboard', icon: LayoutDashboard },
    { to: '/catalog', label: 'All Courses', icon: BookOpen },
    { to: '/analytics', label: 'Student Performance', icon: BarChart3 }
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Command Center', icon: LayoutDashboard },
    { to: '/catalog', label: 'Course Directory', icon: BookOpen },
    { to: '/users', label: 'User Approvals & Roster', icon: Users },
    { to: '/announcements', label: 'Announcements', icon: Megaphone }
  ];

  const links = role === 'Admin' ? adminLinks : role === 'Trainer' ? trainerLinks : traineeLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full min-h-screen shrink-0 shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
              CAPACITY<span className="text-indigo-600">CONNECT</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Competency Engine</p>
          </div>
        </div>

        {/* User Role Card */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Logged In As</div>
          <div className="font-bold text-slate-800 text-sm truncate">{user?.name}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                role === 'Admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : role === 'Trainer'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {role}
            </span>
            <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation</div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
