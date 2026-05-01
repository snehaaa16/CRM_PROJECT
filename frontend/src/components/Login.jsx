import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', { username, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-900 selection:text-cyan-100">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-3xl mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            C
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username</label>
            <input required type="text" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
            <input required type="password" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-8 text-slate-400">
          Don't have an account? <Link to="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
