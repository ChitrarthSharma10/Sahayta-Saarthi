import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DemoSwitcher from '../components/DemoSwitcher';
import { Megaphone, Send } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const annRes = await api.get('/announcements');
      setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    setPublishing(true);
    try {
      await api.post('/announcements', { title: annTitle, content: annContent });
      setAnnTitle('');
      setAnnContent('');
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing announcement');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoSwitcher />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Announcements" />

          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Publisher Form (1 Col) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
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
