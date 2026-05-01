import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Building2, CheckSquare, UserCircle, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const [newLead, setNewLead] = useState({
    name: '', email: '', phone: '', company: '', status: 'NEW', dealValue: '', assignedUserId: ''
  });

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  const fetchData = async () => {
    try {
      const leadsRes = await axios.get('http://localhost:8080/api/leads');
      setLeads(leadsRes.data);
      
      if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') {
        const usersRes = await axios.get('http://localhost:8080/api/users');
        setUsers(usersRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const [editingLeadId, setEditingLeadId] = useState(null);

  const openEditModal = (lead) => {
    setNewLead({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      dealValue: lead.dealValue || '',
      assignedUserId: lead.assignedUserId ? lead.assignedUserId.toString() : ''
    });
    setEditingLeadId(lead.id);
    setIsModalOpen(true);
  };

  const handleAddOrEditLead = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newLead };
      if (payload.assignedUserId) {
        const assignedUser = users.find(u => u.id.toString() === payload.assignedUserId);
        payload.assignedUserName = assignedUser?.username;
      }
      
      if (editingLeadId) {
        await axios.put(`http://localhost:8080/api/leads/${editingLeadId}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/leads', payload);
      }
      
      setIsModalOpen(false);
      setEditingLeadId(null);
      setNewLead({ name: '', email: '', phone: '', company: '', status: 'NEW', dealValue: '', assignedUserId: '' });
      fetchData();
    } catch (error) { console.error('Error saving lead:', error); }
  };

  const deleteLead = async (id) => {
    if(window.confirm('Delete this lead?')) {
      try {
        await axios.delete(`http://localhost:8080/api/leads/${id}`);
        fetchData();
        setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
      } catch (error) { 
        alert('You do not have permission to delete this lead.');
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedLeads(leads.map(l => l.id));
    else setSelectedLeads([]);
  };

  const handleSelect = (id) => {
    if (selectedLeads.includes(id)) setSelectedLeads(selectedLeads.filter(l => l !== id));
    else setSelectedLeads([...selectedLeads, id]);
  };

  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    
    setIsUpdatingBulk(true);
    try {
      const leadsToUpdate = leads.filter(l => selectedLeads.includes(l.id));
      await Promise.all(leadsToUpdate.map(lead => 
        axios.put(`http://localhost:8080/api/leads/${lead.id}`, { ...lead, status: newStatus })
      ));
      setSelectedLeads([]); 
      await fetchData(); 
    } catch (error) {
      console.error('Error in bulk update:', error);
    } finally {
      setIsUpdatingBulk(false);
      e.target.value = ''; 
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      NEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      CONTACTED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      QUALIFIED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      PROPOSAL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      WON: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      LOST: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles[status] || 'bg-white/5 text-slate-400 border-white/10'} shadow-sm`}>{status}</span>;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Deal Value', 'Assigned To'];
    const csvContent = [
      headers.join(','),
      ...leads.map(l => `"${l.name}","${l.email}","${l.phone || ''}","${l.company}","${l.status}","${l.dealValue}","${l.assignedUserName || 'Unassigned'}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'crm_leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-24 bg-[#050505] min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-end mb-8 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Active Leads <Sparkles className="text-fuchsia-400" size={24}/>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Manage, track, and bulk update your prospect pipeline.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={exportToCSV}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            Export CSV
          </button>
          {user?.role !== 'ROLE_USER' && (
            <button 
              onClick={() => { setEditingLeadId(null); setNewLead({ name: '', email: '', phone: '', company: '', status: 'NEW', dealValue: '', assignedUserId: '' }); setIsModalOpen(true); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] transform hover:-translate-y-0.5"
            >
              <Plus size={20} strokeWidth={3} /> Add New Lead
            </button>
          )}
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative z-10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white transition-all font-medium text-sm placeholder-slate-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#121212]/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-white/10">
              <tr>
                <th className="px-6 py-5 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/20 bg-[#121212] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-[#0A0A0A] cursor-pointer"
                    onChange={handleSelectAll}
                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                  />
                </th>
                <th className="px-4 py-5">Prospect Details</th>
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Assigned To</th>
                <th className="px-8 py-5">Deal Value</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="8" className="px-8 py-12 text-center text-slate-500 font-medium">Loading leads data...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="8" className="px-8 py-16 text-center text-slate-500 font-medium">Pipeline is empty. Add a lead to get started.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-white/5 transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-cyan-500/5' : ''}`}>
                    <td className="px-6 py-5">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/20 bg-[#121212] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-[#0A0A0A] cursor-pointer"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelect(lead.id)}
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{lead.name}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><Mail size={12}/> {lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <Building2 size={16} className="text-slate-500" /> {lead.company}
                      </div>
                    </td>
                    <td className="px-8 py-5">{getStatusBadge(lead.status)}</td>
                    <td className="px-8 py-5">
                      {lead.assignedUserName ? (
                        <div className="flex items-center gap-2">
                          <img src={`https://ui-avatars.com/api/?name=${lead.assignedUserName}&background=06b6d4&color=fff`} className="w-6 h-6 rounded-full border border-white/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" />
                          <span className="text-sm font-semibold text-slate-300">{lead.assignedUserName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                        ${lead.dealValue ? lead.dealValue.toLocaleString() : '0'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(lead)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors border border-transparent hover:border-cyan-500/20"><Edit2 size={16} /></button>
                        {user?.role !== 'ROLE_USER' && (
                          <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 bg-cyan-900/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.4)] flex items-center gap-6 z-50 animate-bounce-short border border-cyan-400/50">
          <div className="flex items-center gap-2 font-semibold">
            <CheckSquare className="text-cyan-200" size={20} />
            {selectedLeads.length} leads selected
          </div>
          <div className="h-6 w-px bg-cyan-400/30"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-cyan-100 font-medium">Move to:</span>
            <select 
              className="bg-[#0A0A0A] border border-cyan-500/50 text-white text-sm rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2 outline-none font-semibold cursor-pointer"
              onChange={handleBulkStatusChange}
              disabled={isUpdatingBulk}
              defaultValue=""
            >
              <option value="" disabled>Select Status...</option>
              <option value="NEW">New Leads</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="WON">Closed Won</option>
              <option value="LOST">Closed Lost</option>
            </select>
          </div>
          {isUpdatingBulk && <span className="text-sm text-cyan-200 animate-pulse font-medium">Updating...</span>}
        </div>
      )}

      {/* Add Lead Modal - Dark Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A]/95 rounded-[2rem] w-full max-w-lg p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] border border-cyan-500/20 transform transition-all scale-100 opacity-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-[50px] pointer-events-none"></div>
            
            <h2 className="text-3xl font-extrabold text-white mb-8 relative z-10 tracking-tight">{editingLeadId ? 'Edit Prospect' : 'Create Prospect'}</h2>
            <form onSubmit={handleAddOrEditLead} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input required type="text" disabled={user?.role === 'ROLE_USER'} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input required type="email" disabled={user?.role === 'ROLE_USER'} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <input type="text" disabled={user?.role === 'ROLE_USER'} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} placeholder="+1 234 567 890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Company</label>
                  <input type="text" disabled={user?.role === 'ROLE_USER'} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Deal Value ($)</label>
                  <input type="number" disabled={user?.role === 'ROLE_USER'} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" value={newLead.dealValue} onChange={e => setNewLead({...newLead, dealValue: e.target.value})} placeholder="10000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Lead Status</label>
                <select 
                  className="w-full px-5 py-3 bg-[#121212] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white"
                  value={newLead.status} 
                  onChange={e => setNewLead({...newLead, status: e.target.value})}
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="WON">Closed Won</option>
                  <option value="LOST">Closed Lost</option>
                </select>
              </div>
              
              {user?.role !== 'ROLE_USER' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Assign To (Sales Representative)</label>
                  <select 
                    className="w-full px-5 py-3 bg-[#121212] border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white" 
                    value={newLead.assignedUserId} 
                    onChange={e => setNewLead({...newLead, assignedUserId: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.filter(u => u.role === 'ROLE_USER').map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-white/10">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingLeadId(null); }} className="px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">{editingLeadId ? 'Update Prospect' : 'Create Prospect'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;
