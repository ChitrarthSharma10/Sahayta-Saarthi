import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, UserCheck, PlayCircle, Award, CheckCircle2 } from 'lucide-react';

export default function CourseCard({ course, isEnrolled, onEnroll, userRole }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100 uppercase tracking-wider">
            {course.category || 'General'}
          </span>
          {isEnrolled && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Enrolled
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
          {course.title}
        </h3>

        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium border-t border-slate-100 pt-3">
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span>Instructor: {course.createdBy?.name || 'Lead Trainer'}</span>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/course/${course._id}`)}
          className="flex-1 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          View Details
        </button>

        {userRole === 'Trainee' && !isEnrolled && (
          <button
            onClick={() => onEnroll(course._id)}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Enroll Now
          </button>
        )}

        {isEnrolled && (
          <button
            onClick={() => navigate(`/course/${course._id}`)}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4" />
            Continue Course
          </button>
        )}
      </div>
    </div>
  );
}
