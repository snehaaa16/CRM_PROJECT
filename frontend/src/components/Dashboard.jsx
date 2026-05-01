import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, DollarSign, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/leads');
        setLeads(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalLeads = leads.length;
  const revenue = leads.filter(lead => lead.status !== 'LOST').reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  const wonLeads = leads.filter(lead => lead.status === 'WON').length;
  const conversionRate = totalLeads === 0 ? 0 : ((wonLeads / totalLeads) * 100).toFixed(1);
  const activeDeals = leads.filter(lead => !['WON', 'LOST'].includes(lead.status)).length;

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  // Chart Data Processing
  const revenueData = [
    { name: 'New', value: leads.filter(l => l.status === 'NEW').reduce((s, l) => s + (l.dealValue || 0), 0) },
    { name: 'Contacted', value: leads.filter(l => l.status === 'CONTACTED').reduce((s, l) => s + (l.dealValue || 0), 0) },
    { name: 'Qualified', value: leads.filter(l => l.status === 'QUALIFIED').reduce((s, l) => s + (l.dealValue || 0), 0) },
    { name: 'Proposal', value: leads.filter(l => l.status === 'PROPOSAL').reduce((s, l) => s + (l.dealValue || 0), 0) },
    { name: 'Won', value: leads.filter(l => l.status === 'WON').reduce((s, l) => s + (l.dealValue || 0), 0) },
  ];

  const distributionData = [
    { name: 'New', value: leads.filter(l => l.status === 'NEW').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'CONTACTED').length },
    { name: 'Qualified', value: leads.filter(l => l.status === 'QUALIFIED').length },
    { name: 'Proposal', value: leads.filter(l => l.status === 'PROPOSAL').length },
  ];

  const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#06b6d4']; // Blue, Orange, Purple, Cyan

  if (loading) {
    return <div className="p-10 flex items-center justify-center h-full bg-[#050505] min-h-screen"><p className="text-xl text-slate-500 font-medium">Loading Dashboard Data...</p></div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen bg-[#050505]">
      <div className="mb-10 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight relative z-10 flex items-center gap-3">
          Dashboard Overview <Sparkles className="text-cyan-400" size={24} />
        </h1>
        <p className="text-slate-400 mt-2 font-medium relative z-10">
          Welcome back, <span className="text-cyan-400 font-bold">{user?.username}</span>! 
          {user?.role === 'ROLE_ADMIN' ? ' Here is the global team performance.' : ' Here is your sales pipeline.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl transition-all group-hover:bg-cyan-500/20"></div>
          <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Users size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-400">Total Leads</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{totalLeads}</h3>
        </div>
        
        <div className="bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20"></div>
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <DollarSign size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-400">{user?.role === 'ROLE_ADMIN' ? 'Total Pipeline' : 'Your Pipeline'}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">${revenue.toLocaleString()}</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-fuchsia-500/30 transition-all">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-fuchsia-500/10 blur-2xl transition-all group-hover:bg-fuchsia-500/20"></div>
          <div className="w-12 h-12 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl flex items-center justify-center mb-4 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-400">Conversion Rate</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{conversionRate}%</h3>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl transition-all group-hover:bg-orange-500/20"></div>
          <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Activity size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-400">Active Deals</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{activeDeals}</h3>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart: Revenue Pipeline */}
        <div className="lg:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Revenue Pipeline by Stage
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Pipeline Value']}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart: Lead Distribution */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">Active Deal Distribution</h3>
          <p className="text-slate-400 text-sm mb-6">Where your leads are currently sitting.</p>
          
          <div className="flex-1 min-h-[250px] flex items-center justify-center -mt-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {distributionData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm font-medium text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-xl font-bold text-white mb-6">Recent Deal Activity</h3>
        {recentLeads.length === 0 ? (
          <p className="text-slate-400 text-sm">No recent activity found. Add leads to see them here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <Activity size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white line-clamp-1">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.company}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-white/5">
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-1 rounded-md">{lead.status}</span>
                  <span className="text-sm text-emerald-400 font-bold">${lead.dealValue || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
