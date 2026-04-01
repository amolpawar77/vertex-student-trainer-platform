import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { db, collection, onSnapshot, query, where, limit, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { label: 'Total Candidates', value: '0', icon: Users, color: 'bg-blue-500', trend: '+0%' },
    { label: 'Active Sessions', value: '0', icon: Calendar, color: 'bg-orange-500', trend: '+0' },
    { label: 'Assignments', value: '0', icon: BookOpen, color: 'bg-purple-500', trend: '+0' },
    { label: 'Completion Rate', value: '0%', icon: TrendingUp, color: 'bg-green-500', trend: '+0%' },
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // Fetch Stats (Simplified for now)
    const unsubUsers = onSnapshot(query(collection(db, 'users'), where('role', '==', 'student')), (snap) => {
      setStats(prev => prev.map(s => s.label === 'Total Candidates' ? { ...s, value: String(snap.size) } : s));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const unsubSessions = onSnapshot(collection(db, 'sessions'), (snap) => {
      setStats(prev => prev.map(s => s.label === 'Active Sessions' ? { ...s, value: String(snap.size) } : s));
      
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpcomingSessions(list.slice(0, 3));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sessions');
    });

    const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snap) => {
      setStats(prev => prev.map(s => s.label === 'Assignments' ? { ...s, value: String(snap.size) } : s));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'assignments');
    });

    setLoading(false);

    return () => {
      unsubUsers();
      unsubSessions();
      unsubAssignments();
    };
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-slate-500">Welcome to Vertex IT Hub. Here's your overview for today.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Calendar size={18} />
          <span>Schedule Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-lg">Recent Activity</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Clock size={48} className="mb-4 opacity-20" />
              <p className="text-sm italic">Activity tracking coming soon...</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-6">Upcoming Sessions</h2>
          <div className="space-y-6">
            {upcomingSessions.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No upcoming sessions scheduled.</p>
            ) : upcomingSessions.map((session) => (
              <div key={session.id} className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase">{session.date?.split(' ')[0]}</span>
                  <span className="text-xl font-bold text-slate-700 group-hover:text-primary">{session.date?.split(' ')[1]?.replace(',', '')}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm group-hover:text-primary transition-all">{session.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{session.time} • {session.duration}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                    <span className="text-xs text-slate-400">By {session.trainer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-medium hover:border-primary hover:text-primary transition-all">
            + Add New Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
