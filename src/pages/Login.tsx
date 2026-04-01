import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  AlertCircle,
  User
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, db, doc, getDoc, setDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'trainer'>('student');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile with selected role
        const newUser = {
          uid: user.uid,
          name: user.displayName || 'New User',
          email: user.email || '',
          role: selectedRole, // Use selected role
          avatar: user.photoURL || '',
          batch: selectedRole === 'student' ? 'Unassigned' : 'N/A',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), newUser);
        onLogin(newUser);
      } else {
        onLogin(userDoc.data());
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign Up Logic
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const newUser = {
          uid: user.uid,
          name: name || email.split('@')[0],
          email: user.email || email,
          role: selectedRole,
          avatar: '',
          batch: selectedRole === 'student' ? 'Unassigned' : 'N/A',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), newUser);
        onLogin(newUser);
      } else {
        // Login Logic
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          onLogin(userDoc.data());
        } else {
          // If profile doesn't exist, create a basic one
          const newUser = {
            uid: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email || email,
            role: 'student',
            avatar: '',
            batch: 'Unassigned',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), newUser);
          onLogin(newUser);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please use Google Login or Create an Account.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to authenticate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img 
              src="https://storage.googleapis.com/static.ai.studio/build/fb14c803-14af-4135-8601-0e0a31ab1cae/input_file_0.png" 
              alt="Vertex IT Hub Logo" 
              className="max-w-[240px] h-auto object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = "w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl shadow-primary/20";
                  fallback.innerText = "V";
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Vertex IT Hub</h1>
          <p className="text-slate-500 mt-2">Excellence in IT Training & Development.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-xl font-bold mb-6">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                {!isSignUp && <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'student' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Join as Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('trainer')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'trainer' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Join as Trainer
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-primary/20'
              }`}
            >
              <span>{isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold text-slate-400">
                <span className="bg-white px-4">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600"
              >
                <Chrome size={18} />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600">
                <Github size={18} />
                GitHub
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"} {' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-primary hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
