import { LayoutDashboard, Users, Kanban, Settings, Sparkles, LogOut, UserCircle, Activity } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Leads Table', icon: Users, path: '/leads' },
    { name: 'Pipeline', icon: Kanban, path: '/board' },
    { name: 'My Profile', icon: UserCircle, path: '/profile' }
  ];

  // Role based menu: Admin sees Settings and Logs
  if (user?.role === 'ROLE_ADMIN') {
    menuItems.push({ name: 'Team Settings', icon: Settings, path: '/settings' });
    menuItems.push({ name: 'Audit Logs', icon: Activity, path: '/logs' });
  }

  return (
    <div className="w-72 h-[96vh] m-4 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-3xl flex flex-col fixed left-0 top-0 overflow-hidden z-20">
      <div className="p-8 flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 rounded-xl"></div>
          <div className="relative bg-gradient-to-tr from-cyan-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            C
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">CRM Pro</span>
          <p className="text-xs text-cyan-400 font-bold tracking-wider uppercase mt-0.5">Workspace</p>
        </div>
      </div>
      
      <nav className="flex-1 px-6 mt-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
              <Icon size={22} className={`${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors`} />
              <span className="font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile and Logout */}
      <div className="p-5 border-t border-white/10 bg-[#0A0A0A]/50">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=06b6d4&color=fff`} alt="User" className="w-10 h-10 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-full border-2 border-[#0A0A0A]" />
            <div>
              <p className="text-sm font-bold text-white line-clamp-1">{user?.username || 'User'}</p>
              <p className="text-xs text-cyan-400 font-bold">{user?.role === 'ROLE_ADMIN' ? 'Admin' : user?.role === 'ROLE_MANAGER' ? 'Manager' : 'Sales Rep'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
