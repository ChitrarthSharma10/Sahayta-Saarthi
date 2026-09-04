import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { Search, BookOpen, Filter } from 'lucide-react';

export default function CourseCatalog() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching course directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert('Successfully enrolled in course!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const categories = ['All', ...new Set(courses.map((c) => c.category || 'General'))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Organizational Course Directory" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses by keyword or skill..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Cards Grid */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading course directory...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No matching courses found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((c) => {
                  const isEnrolled = c.enrolledTrainees?.some(
                    (tId) => (tId._id || tId) === user?._id || (tId.id || tId) === user?.id
                  );
                  return (
                    <CourseCard
                      key={c._id}
                      course={c}
                      isEnrolled={isEnrolled}
                      onEnroll={handleEnroll}
                      userRole={user?.role}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
