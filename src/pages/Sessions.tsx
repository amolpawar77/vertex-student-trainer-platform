import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Video, 
  Users, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { getSessions } from '../api';

const Sessions: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions()
      .then((response) => {
        setSessions(response.data.records || []);
      })
      .catch((error) => {
        console.error('Sessions load failed:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="text-primary" />
            Session Management
          </h1>
          <p className="text-slate-500">Schedule and manage learning sessions for your batches.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>New Session</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            List View
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              view === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Calendar
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all"><ChevronLeft size={18} /></button>
            <span>April 2026</span>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                <span className="text-xs font-bold text-slate-400 uppercase">{session.date.split(' ')[0]}</span>
                <span className="text-2xl font-bold text-slate-700 group-hover:text-primary">{session.date.split(' ')[1].replace(',', '')}</span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-all">{session.title}</h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-wider">
                    {session.batch}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={16} className="text-slate-400" />
                    <span>{session.time} • {session.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Users size={16} className="text-slate-400" />
                    <span>{session.attendees} Candidates</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    {session.type === 'online' ? (
                      <>
                        <Video size={16} className="text-slate-400" />
                        <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                          Google Meet <ExternalLink size={12} />
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} className="text-slate-400" />
                        <span>{session.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-all">
                  Edit
                </button>
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
