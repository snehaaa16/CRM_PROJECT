import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, ShieldCheck, Zap, Send } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Landing = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', dealValue: '' });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/public/webhooks/leads', {
        ...formData,
        dealValue: formData.dealValue || 0
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', dealValue: '' });
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              C
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CRM Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-400 font-semibold hover:text-cyan-400 transition-colors">Log In</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-white hover:bg-slate-200 text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-40 pb-24 px-6 relative overflow-hidden">
        {/* Neon Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-semibold text-sm mb-8 backdrop-blur-md">
            <SparkleIcon /> Next-Generation B2B Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-tight mb-8">
            Manage Pipelines. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">
              Close Faster.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The intelligent CRM built for high-growth tech teams. Experience real-time analytics, military-grade security, and seamless workflows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <a href="#demo-form" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-lg flex items-center justify-center transition-all backdrop-blur-sm">
              Request Demo
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative z-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Engineering Excellence</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Built from the ground up to solve complex enterprise sales problems.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="text-cyan-400" size={32} />}
              title="Live Analytics"
              desc="Monitor your entire revenue pipeline with beautiful, live-updating dashboards tailored to your exact role."
              glow="cyan"
            />
            <FeatureCard 
              icon={<Users className="text-fuchsia-400" size={32} />}
              title="RBAC Security"
              desc="Military-grade role-based access control. Employees only see exactly what the Admin allows them to see."
              glow="fuchsia"
            />
            <FeatureCard 
              icon={<Zap className="text-emerald-400" size={32} />}
              title="Webhook API"
              desc="Connect external forms directly to your CRM pipeline with our lightning-fast open Webhook endpoints."
              glow="emerald"
            />
          </div>
        </div>
      </div>

      {/* Dark Form Section */}
      <div id="demo-form" className="py-32 relative z-20 bg-[#0A0A0A]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row gap-12 shadow-2xl">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-extrabold text-white tracking-tight mb-6">Ready to supercharge your sales?</h2>
              <p className="text-lg text-slate-400 mb-10">Request a personalized demo today. See firsthand how CRM Pro can streamline your pipeline, secure your data, and help your team close deals faster.</p>
              
              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Request Access</h4>
                    <p className="text-slate-400 mt-1">Fill out the form to tell us about your team.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-2xl flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Get a Custom Demo</h4>
                    <p className="text-slate-400 mt-1">We'll give you a tailored walkthrough of the platform.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 rounded-2xl flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Start Closing Deals</h4>
                    <p className="text-slate-400 mt-1">Onboard your team and watch your revenue grow.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-[#050505] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px]"></div>
              
              {submitStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckIcon />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Request Sent!</h3>
                  <p className="text-slate-400">Our team will reach out to you shortly to schedule your demo.</p>
                  <button onClick={() => setSubmitStatus(null)} className="mt-4 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-5 relative z-10">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Work Email</label>
                    <input required type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@startup.io" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Company</label>
                      <input required type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white transition-all" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Acme Inc" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Budget ($)</label>
                      <input type="number" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white transition-all" value={formData.dealValue} onChange={e => setFormData({...formData, dealValue: e.target.value})} placeholder="25000" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 mt-4 bg-white text-black hover:bg-cyan-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Request Demo <Send size={18} />
                  </button>
                  {submitStatus === 'error' && <p className="text-red-400 text-sm text-center font-medium mt-2">Something went wrong. Please try again.</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 text-center border-t border-white/5">
        <p className="text-slate-600 font-medium">© 2026 CRM Pro. Engineered for Scale.</p>
      </footer>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeatureCard = ({ icon, title, desc, glow }) => {
  const glowMap = {
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30',
    fuchsia: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/30',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30',
  };

  return (
    <div className={`p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 ${glowMap[glow]} hover:-translate-y-2 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="w-16 h-16 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium relative z-10">{desc}</p>
    </div>
  );
};

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
  </svg>
);

export default Landing;
