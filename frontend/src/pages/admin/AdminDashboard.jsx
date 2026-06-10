import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Briefcase, Building2, ClipboardList, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { adminStats, recruiters, jobs, applications, fetchAdminData, fetchJobs, fetchApplications } = useApp();

  useEffect(() => {
    fetchAdminData();
    fetchJobs();
    fetchApplications();
  }, []);

  const pending = recruiters.filter(r => r.status === 'pending');

  const stats = [
    { label: 'Total Students', value: adminStats.totalStudents || 0, icon: Users, color: '#2563eb', bg: '#dbeafe' },
    { label: 'Approved Recruiters', value: adminStats.totalRecruiters || 0, icon: Building2, color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Active Jobs', value: adminStats.totalJobs || 0, icon: Briefcase, color: '#059669', bg: '#d1fae5' },
    { label: 'Total Applications', value: adminStats.totalApplications || 0, icon: ClipboardList, color: '#d97706', bg: '#fef3c7' },
  ];

  const statusList = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      {pending.length > 0 && (
        <div className="alert alert-info" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} />
          <span>{pending.length} company approval{pending.length > 1 ? 's' : ''} pending. </span>
          <Link to="/admin/companies" style={{ color: '#1d4ed8', fontWeight: '600' }}>Review now →</Link>
        </div>
      )}

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={22} color={s.color} /></div>
            <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Recent Job Posts</h3>
            <Link to="/admin/jobs" style={{ color: '#dc2626', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
          </div>
          {jobs.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No jobs yet.</p>
          ) : (
            jobs.slice(0, 5).map(job => (
              <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{job.title}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>{job.recruiterId?.companyName} • {job.location}</div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>Application Overview</h3>
          {statusList.map(status => {
            const count = applications.filter(a => a.status === status).length;
            const pct = applications.length ? Math.round((count / applications.length) * 100) : 0;
            return (
              <div key={status} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{status}</span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{count} ({pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: status === 'Rejected' ? '#ef4444' : status === 'Selected' ? '#10b981' : '#2563eb' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
