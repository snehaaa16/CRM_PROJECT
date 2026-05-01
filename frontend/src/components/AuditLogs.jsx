import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Activity, User, ShieldCheck } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/audit-logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === 'ROLE_ADMIN') fetchLogs();
  }, [user]);

  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <h2 className="text-2xl font-bold text-slate-500">Access Denied: Admins Only</h2>
      </div>
    );
  }

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    if (action.includes('UPDATE')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
    if (action.includes('DELETE')) return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
    return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.1)]';
  };

  return (
    <div className="p-10 max-w-7xl mx-auto h-screen flex flex-col bg-[#050505]">
      <div className="flex justify-between items-end mb-8 shrink-0 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="text-cyan-400" size={36} /> System Audit Logs
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Track all activities, changes, and webhooks across the system.</p>
        </div>
      </div>

      <div className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 flex-1 overflow-hidden flex flex-col relative z-10">
        <div className="overflow-y-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#121212]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">Timestamp</th>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">User / Source</th>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider">Action</th>
                <th className="px-8 py-5 text-slate-500 font-bold text-sm uppercase tracking-wider w-1/2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500">No logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-white flex items-center gap-2">
                        {log.performedBy.includes('System') ? <ShieldCheck size={16} className="text-fuchsia-400"/> : <User size={16} className="text-cyan-400"/>}
                        {log.performedBy}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-400 text-sm">
                      {log.details}
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

export default AuditLogs;
