import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Settings, 
  LogOut,
  Code2,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'student' | 'trainer';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const adminLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/candidates', icon: Users, label: 'Candidates' },
    { to: '/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/assignments', icon: BookOpen, label: 'Assignments' },
    { to: '/tasks', icon: CheckSquare, label: 'Daily Tasks' },
    { to: '/compiler', icon: Code2, label: 'Code Playground' },
  ];

  const trainerLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/candidates', icon: Users, label: 'Candidates' },
    { to: '/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/assignments', icon: BookOpen, label: 'Assignments' },
    { to: '/compiler', icon: Code2, label: 'Code Playground' },
  ];

  const studentLinks = [
    { to: '/', icon: LayoutDashboard, label: 'My Progress' },
    { to: '/sessions', icon: Calendar, label: 'My Sessions' },
    { to: '/assignments', icon: GraduationCap, label: 'Assignments' },
    { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
    { to: '/compiler', icon: Code2, label: 'Compiler' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : studentLinks;

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-3 px-4 py-6 mb-8">
        <img 
          src="https://storage.googleapis.com/static.ai.studio/build/fb14c803-14af-4135-8601-0e0a31ab1cae/input_file_0.png" 
          alt="Vertex IT Hub Logo" 
          className="h-12 w-auto object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = "flex items-center gap-3";
              fallback.innerHTML = `
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">V</div>
                <div>
                  <h1 class="font-bold text-lg leading-tight">Vertex IT Hub</h1>
                  <p class="text-xs text-text-muted">IT Training & Solutions</p>
                </div>
              `;
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-100">
        <NavLink to="/settings" className="sidebar-link mb-2">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={onLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
