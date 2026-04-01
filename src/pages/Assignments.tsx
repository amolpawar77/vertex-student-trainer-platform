import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText, 
  Code, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Eye
} from 'lucide-react';
import { db, collection, onSnapshot, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

const Assignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'graded'>('all');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const path = 'assignments';
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const assignmentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentsList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="text-primary" />
            Assignments
          </h1>
          <p className="text-slate-500">Create and grade assignments for your candidates.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Create Assignment</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {(['all', 'active', 'graded'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${assignment.type === 'coding' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {assignment.type === 'coding' ? <Code size={24} /> : <FileText size={24} />}
              </div>
              <button className="p-1 text-slate-400 hover:text-primary transition-all">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  {assignment.batch}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  assignment.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {assignment.status}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-all">{assignment.title}</h3>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Clock size={16} />
                    Due Date
                  </span>
                  <span className="font-semibold">{assignment.dueDate}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">Submissions</span>
                    <span className="text-slate-700">{assignment.submissions}/{assignment.total}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-bold transition-all">
                <Eye size={16} />
                View
              </button>
              <button className="flex items-center justify-center gap-2 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-bold transition-all">
                <CheckCircle2 size={16} />
                Grade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
