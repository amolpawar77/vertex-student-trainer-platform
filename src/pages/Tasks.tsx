import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  MoreVertical,
  Filter,
  Users
} from 'lucide-react';
import { getTasks } from '../api';

interface TasksProps {
  currentUser: any;
}

const Tasks: React.FC<TasksProps> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    getTasks(currentUser.uid)
      .then((response) => {
        setTasks(response.data.records || []);
      })
      .catch((error) => {
        console.error('Tasks load failed:', error);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <CheckSquare className="text-primary" />
            Daily Tasks
          </h1>
          <p className="text-slate-500">Track and manage daily learning goals for your students.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500">Filter by:</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">All Batches</button>
                <button className="px-3 py-1 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition-all">Batch A</button>
                <button className="px-3 py-1 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition-all">Batch B</button>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-primary transition-all">
              <Filter size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <button className={`mt-1 transition-all ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-primary'}`}>
                    {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Users size={14} />
                        <span>{task.batch}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Clock size={14} />
                        <span>Deadline: {task.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 text-slate-300 hover:text-slate-500 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Task Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-600">Total Tasks</span>
                <span className="font-bold text-slate-800">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-600">Completed</span>
                <span className="font-bold text-green-700">18</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="text-sm font-medium text-orange-600">In Progress</span>
                <span className="font-bold text-orange-700">4</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <span className="text-sm font-medium text-red-600">Overdue</span>
                <span className="font-bold text-red-700">2</span>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
            <AlertCircle size={32} className="mb-4 opacity-50" />
            <h3 className="font-bold text-lg mb-2">Weekly Goal</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Complete all assignments and attend at least 4 live sessions this week.
            </p>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-3/4"></div>
            </div>
            <p className="text-[10px] font-bold mt-2 text-white/60 uppercase tracking-wider text-right">75% Achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
