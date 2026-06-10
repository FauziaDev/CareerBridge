import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const typeIcon = {
  success: <CheckCircle size={18} color="#10b981" />,
  info: <Info size={18} color="#2563eb" />,
  warning: <AlertTriangle size={18} color="#f59e0b" />,
  error: <XCircle size={18} color="#ef4444" />,
};
const typeBg = { success: '#f0fdf4', info: '#eff6ff', warning: '#fffbeb', error: '#fef2f2' };

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, fetchNotifications } = useApp();

  useEffect(() => { fetchNotifications(); }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b' }}>Notifications</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <Bell size={48} />
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n._id} onClick={() => markNotificationRead(n._id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                background: n.isRead ? 'white' : typeBg[n.type] || '#eff6ff',
                border: `1px solid ${n.isRead ? '#e2e8f0' : '#bfdbfe'}`,
                boxShadow: n.isRead ? 'none' : '0 2px 8px rgba(37,99,235,0.08)',
                transition: 'all 0.2s'
              }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {typeIcon[n.type] || <Bell size={18} color="#64748b" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: n.isRead ? '400' : '600', lineHeight: '1.5' }}>
                  {n.message}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {new Date(n.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              {!n.isRead && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', flexShrink: 0, marginTop: '6px' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
