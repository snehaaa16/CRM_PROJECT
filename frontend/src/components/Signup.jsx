import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, User, Lock, Mail, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'ROLE_USER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. Create account
      await axios.post('http://localhost:8080/api/auth/signup', formData);
      
      // 2. Automatically login the user
      const loginResponse = await axios.post('http://localhost:8080/api/auth/signin', {
        username: formData.username,
        password: formData.password
      });
      
      // Fix: Immediately update the axios header so subsequent requests work
      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.accessToken}`;
      
      // 3. Save to context and navigate to dashboard
      login(loginResponse.data);
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-900 selection:text-cyan-100">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fuchsia-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 text-white font-bold text-3xl mb-6 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            C
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Join CRM Pro</h2>
          <p className="text-slate-400 mt-2">Start managing your pipeline today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username</label>
            <input required type="text" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Choose a username" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input required type="email" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
            <input required type="password" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-white" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Create a strong password" />
          </div>

          <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          Already have an account? <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
