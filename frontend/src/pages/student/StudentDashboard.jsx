import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, ClipboardList, Calendar, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColor = {
  'Applied': 'badge-blue', 'Under Review': 'badge-yellow',
  'Shortlisted': 'badge-purple', 'Interview Scheduled': 'badge-green',
  'Selected': 'badge-green', 'Rejected': 'badge-red',
};

export default function StudentDashboard() {
  const { currentUser, jobs, applications, interviews, notifications, fetchJobs, fetchApplications, fetchInterviews, fetchNotifications } = useApp();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchInterviews();
    fetchNotifications();
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const stats = [
    { label: 'Jobs Available', value: jobs.length, icon: Briefcase, color: '#2563eb', bg: '#dbeafe' },
    { label: 'My Applications', value: applications.length, icon: ClipboardList, color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Interviews', value: interviews.length, icon: Calendar, color: '#059669', bg: '#d1fae5' },
    { label: 'Notifications', value: unread, icon: Bell, color: '#d97706', bg: '#fef3c7' },
  ];

  const recentApps = [...applications].reverse().slice(0, 3);
  const recentJobs = jobs.slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {currentUser?.name?.split(' ')[0]} 👋</h1>
        <p>Here's what's happening with your career journey today.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Recent Applications</h3>
            <Link to="/student/applications" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No applications yet. <Link to="/student/jobs" style={{ color: '#2563eb' }}>Browse jobs</Link></p>
            </div>
          ) : (
            recentApps.map(app => {
              const job = app.jobId;
              return (
                <div key={app._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{job?.title || 'Job'}</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {job?.recruiterId?.companyName || ''} • {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Upcoming Interviews</h3>
            <Link to="/student/interviews" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
          </div>
          {interviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No interviews scheduled yet.</p>
            </div>
          ) : (
            interviews.filter(iv => iv.status === 'Scheduled').slice(0, 3).map(iv => {
              const jobTitle = iv.applicationId?.jobId?.title || 'Interview';
              const company = iv.applicationId?.jobId?.recruiterId?.companyName || '';
              return (
                <div key={iv._id} style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', marginBottom: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{jobTitle}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                    🏢 {company} • 📅 {new Date(iv.interviewDate).toLocaleDateString('en-IN')} at {iv.interviewTime}
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>Mode: {iv.mode}</div>
                  {iv.link && <a href={iv.link} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: '13px' }}>Join Meeting →</a>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Latest Jobs</h3>
          <Link to="/student/jobs" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>Browse all →</Link>
        </div>
        {recentJobs.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No jobs available yet.</p>
        ) : (
          <div className="grid-3">
            {recentJobs.map(job => (
              <div key={job._id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>{job.title}</div>
                  <span className="badge badge-blue" style={{ fontSize: '11px' }}>{job.type}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>🏢 {job.recruiterId?.companyName}</div>
                <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>📍 {job.location} • 💰 {job.stipend}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {job.skillsRequired?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                </div>
                <Link to="/student/jobs" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
