import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Briefcase, FileText, Calendar,
  Bell, Users, Building2, Settings, LogOut,
  ClipboardList, UserCheck, BarChart3, ChevronRight
} from 'lucide-react';

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/jobs', icon: Briefcase, label: 'Job Listings' },
  { to: '/student/applications', icon: ClipboardList, label: 'My Applications' },
  { to: '/student/resume', icon: FileText, label: 'Resume Upload' },
  { to: '/student/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/post-job', icon: Briefcase, label: 'Post Job' },
  { to: '/recruiter/applicants', icon: Users, label: 'View Applicants' },
  { to: '/recruiter/interviews', icon: Calendar, label: 'Schedule Interview' },
  { to: '/recruiter/notifications', icon: Bell, label: 'Notifications' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/admin/companies', icon: Building2, label: 'Company Approval' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Monitor Jobs' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

const roleColors = {
  student: { bg: '#2563eb', light: '#eff6ff', text: '#1d4ed8' },
  recruiter: { bg: '#7c3aed', light: '#f5f3ff', text: '#5b21b6' },
  admin: { bg: '#dc2626', light: '#fef2f2', text: '#991b1b' },
};

export default function Sidebar() {
  const { currentUser, logout, notifications } = useApp();
  const role = currentUser?.role;
  const links = role === 'student' ? studentLinks : role === 'recruiter' ? recruiterLinks : adminLinks;
  const colors = roleColors[role] || roleColors.student;
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <aside style={{
      width: '260px', minHeight: '100vh', background: '#1e293b',
      display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={20} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>CareerBridge</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{role} Portal</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '15px'
          }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'User'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{role}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              background: isActive ? colors.bg : 'transparent',
              color: isActive ? 'white' : '#94a3b8',
              transition: 'all 0.2s',
            })}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {label === 'Notifications' && unread > 0 && (
              <span style={{
                background: '#ef4444', color: 'white', borderRadius: '10px',
                padding: '2px 7px', fontSize: '11px', fontWeight: '700'
              }}>{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #334155' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
