import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({ title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Competency Engine Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user?.targetSkills && user.targetSkills.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Active Skill Gap: {user.targetSkills.join(', ')}</span>
          </div>
        )}

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800">{user?.name}</div>
            <div className="text-[11px] text-slate-400 font-medium">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
