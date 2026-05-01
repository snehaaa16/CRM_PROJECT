import { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Building2, DollarSign, GripVertical, Mail, Calendar, Sparkles, Inbox, PhoneCall, CheckCircle2, FileText } from 'lucide-react';

const COLUMNS = [
  { id: 'NEW', title: 'New Leads', icon: Inbox, color: 'bg-white/5 border-white/10', textColor: 'text-blue-400' },
  { id: 'CONTACTED', title: 'Contacted', icon: PhoneCall, color: 'bg-white/5 border-white/10', textColor: 'text-orange-400' },
  { id: 'QUALIFIED', title: 'Qualified', icon: CheckCircle2, color: 'bg-white/5 border-white/10', textColor: 'text-purple-400' },
  { id: 'PROPOSAL', title: 'Proposal Sent', icon: FileText, color: 'bg-white/5 border-white/10', textColor: 'text-cyan-400' },
  { id: 'WON', title: 'Closed Won', icon: DollarSign, color: 'bg-white/5 border-white/10', textColor: 'text-emerald-400' },
];

const LeadBoard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/leads')
      .then(res => { setLeads(res.data); setLoading(false); })
      .catch(err => { console.error('Error fetching leads:', err); setLoading(false); });
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId)) return;

    const leadId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    setLeads(prevLeads => prevLeads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));

    try {
      const leadToUpdate = leads.find(l => l.id === leadId);
      await axios.put(`http://localhost:8080/api/leads/${leadId}`, { ...leadToUpdate, status: newStatus });
    } catch (error) {
      console.error('Failed to update lead status on server', error);
      axios.get('http://localhost:8080/api/leads').then(res => setLeads(res.data));
    }
  };

  const getLeadsByStatus = (status) => leads.filter(lead => lead.status === status);

  if (loading) return <div className="p-10 flex justify-center bg-[#050505] min-h-screen"><p className="text-slate-500 font-medium">Loading Board...</p></div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#050505]">
      <div className="mb-8 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10 flex items-center gap-3">
          Sales Pipeline <Sparkles className="text-cyan-400" size={24}/>
        </h1>
        <p className="text-slate-400 mt-2 font-medium relative z-10">Drag and drop leads to update their status and move them through the funnel.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {COLUMNS.map(column => {
            const columnLeads = getLeadsByStatus(column.id);
            const columnAmount = columnLeads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
            const Icon = column.icon;

            return (
              <div key={column.id} className={`flex-shrink-0 w-[350px] rounded-3xl ${column.color} border p-5 flex flex-col max-h-[80vh] snap-center`}>
                <div className="flex justify-between items-center mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${column.textColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-white`}>{column.title}</h3>
                      <p className="text-xs font-semibold text-slate-400">{columnLeads.length} Deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${column.textColor}`}>${columnAmount.toLocaleString()}</p>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                      className={`flex flex-col gap-4 overflow-y-auto flex-grow p-1 transition-all rounded-2xl ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}
                    >
                      {columnLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#121212] p-5 rounded-2xl border border-white/5 transition-all ${
                                snapshot.isDragging ? 'shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-2 ring-cyan-500/50' : 'hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-white text-base line-clamp-1 group-hover:text-cyan-400">{lead.name}</h4>
                                <GripVertical size={18} className="text-slate-600 shrink-0" />
                              </div>
                              <div className="space-y-2.5 mb-5">
                                {lead.company && (
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Building2 size={14} className="text-slate-500" />
                                    <span className="line-clamp-1">{lead.company}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Mail size={14} className="text-slate-500" />
                                  <span className="line-clamp-1">{lead.email}</span>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg text-sm border border-cyan-500/20">
                                  ${lead.dealValue?.toLocaleString() || 0}
                                </span>
                                {lead.assignedUserName && (
                                  <div className="flex items-center gap-2">
                                    <img src={`https://ui-avatars.com/api/?name=${lead.assignedUserName}&background=06b6d4&color=fff`} className="w-6 h-6 rounded-full" alt="Assigned" title={`Assigned to ${lead.assignedUserName}`} />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default LeadBoard;
