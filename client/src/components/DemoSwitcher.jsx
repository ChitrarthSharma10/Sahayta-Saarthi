import React from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { ShieldCheck, UserCheck, GraduationCap, Zap } from 'lucide-react';

export default function DemoSwitcher() {
  const { user, demoLogin, loading } = useAuth();

  const handleSwitch = async (role) => {
    try {
      await demoLogin(role);
    } catch (err) {
      alert(err.response?.data?.message || 'Demo login failed');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'Trainer': return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'Trainee': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 shadow-inner">
      <div className="flex items-center gap-2 font-medium">
        <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[11px]">DEMO SWITCHER</span>
        <span className="hidden md:inline text-slate-400">One-click role tester:</span>
      </div>

      <div className="flex items-center gap-2">
        {Object.keys(DEMO_USERS).map((role) => {
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              disabled={loading}
              onClick={() => handleSwitch(role)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {getRoleIcon(role)}
              <span>{role}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
