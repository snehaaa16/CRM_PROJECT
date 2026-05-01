import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Key, X, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await axios.post('http://localhost:8080/api/auth/change-password', passwords);
      setMessage({ type: 'success', text: res.data.message || 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-md rounded-[2rem] p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 border-b border-white/5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center mt-12">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50"></div>
             <img 
               src={`https://ui-avatars.com/api/?name=${user.username}&background=06b6d4&color=fff&size=128&bold=true`} 
               alt="Profile" 
               className="w-32 h-32 rounded-full border-4 border-[#0A0A0A] shadow-xl mb-6 bg-[#121212] relative z-10"
             />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{user.username}</h1>
          <p className="text-cyan-400 font-bold mt-1 text-lg flex items-center gap-2">
            <ShieldCheck size={20} className={user.role === 'ROLE_ADMIN' ? 'text-fuchsia-400' : 'text-cyan-400'} /> 
            {user.role === 'ROLE_ADMIN' ? 'System Administrator' : user.role === 'ROLE_MANAGER' ? 'Sales Manager' : 'Sales Representative'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex items-center gap-5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0">
              <User className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Username</p>
              <p className="text-lg font-bold text-white">{user.username}</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex items-center gap-5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="text-fuchsia-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-lg font-bold text-white">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center relative z-10">
          <button onClick={() => setIsPasswordModalOpen(true)} className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Key size={18} className="text-cyan-400" /> Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A]/95 rounded-[2rem] w-full max-w-md p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] border border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-[50px] pointer-events-none"></div>
            
            <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors relative z-10"><X size={24} /></button>
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3 relative z-10"><Key className="text-cyan-400" /> Change Password</h2>
            
            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center relative z-10 border ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Current Password</label>
                <input required type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">New Password</label>
                <input required minLength={6} type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
