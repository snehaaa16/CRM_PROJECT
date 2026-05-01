import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserX, Mail, Sparkles } from 'lucide-react';

const TeamSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if(window.confirm('Are you sure you want to remove this employee from the system?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        alert(error.response?.data || 'Error deleting user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Error updating role');
    }
  };

  if (currentUser?.role !== 'ROLE_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <h2 className="text-2xl font-bold text-slate-500">Access Denied: Admins Only</h2>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen bg-[#050505]">
      <div className="flex justify-between items-end mb-10 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Team Management <Sparkles className="text-fuchsia-400" size={24} />
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Manage your company's employees and their system access.</p>
        </div>
      </div>

      <div className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">Employee Name</th>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">Role Setup</th>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-right text-slate-500 font-bold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500">Loading team...</td></tr>
              ) : (
                users.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${member.username}&background=06b6d4&color=fff`} className="w-10 h-10 rounded-full border border-white/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" />
                        <div>
                          <p className="font-bold text-white">{member.username}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><Mail size={12}/> {member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {currentUser.username === member.username ? (
                        <span className="bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 font-bold px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-1 shadow-[0_0_10px_rgba(217,70,239,0.1)]">
                          <ShieldCheck size={14}/> Admin (You)
                        </span>
                      ) : (
                        <select 
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="bg-[#121212] border border-white/10 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2 outline-none font-semibold cursor-pointer"
                        >
                          <option value="ROLE_USER">Sales Representative</option>
                          <option value="ROLE_MANAGER">Sales Manager</option>
                          <option value="ROLE_ADMIN">System Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></span> Active
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {currentUser.username !== member.username && (
                        <button 
                          onClick={() => handleDeleteUser(member.id)}
                          className="text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-auto shadow-[0_0_10px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                          <UserX size={16} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;
