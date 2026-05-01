import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import LeadBoard from './components/LeadBoard';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import TeamSettings from './components/TeamSettings';
import AuditLogs from './components/AuditLogs';
import Landing from './components/Landing';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="flex bg-[#050505] min-h-screen text-slate-200 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <Sidebar />
      <div className="flex-1 ml-[320px] overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><LeadList /></ProtectedRoute>} />
          <Route path="/board" element={<ProtectedRoute><LeadBoard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><TeamSettings /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
