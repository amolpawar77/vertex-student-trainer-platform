import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CodePlayground from './pages/CodePlayground';
import Candidates from './pages/Candidates';
import Sessions from './pages/Sessions';
import Assignments from './pages/Assignments';
import Tasks from './pages/Tasks';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar role={user.role} onLogout={handleLogout} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/compiler" element={<CodePlayground />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/tasks" element={<Tasks currentUser={user} />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
