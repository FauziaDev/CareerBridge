import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useState } from 'react';

const statusColor = {
  'Applied': 'badge-blue', 'Under Review': 'badge-yellow',
  'Shortlisted': 'badge-purple', 'Interview Scheduled': 'badge-green',
  'Selected': 'badge-green', 'Rejected': 'badge-red',
};

export default function RecruiterDashboard() {
  const { jobs, applications, interviews, fetchJobs, fetchApplications, fetchInterviews } = useApp();
  const [myJobs, setMyJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchInterviews();
    // Fetch recruiter-specific jobs
    api.get('/recruiter/profile').then(({ data }) => {
      const recruiterId = data.recruiter._id;
      setMyJobs(jobs.filter(j => j.recruiterId?._id === recruiterId || j.recruiterId === recruiterId));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Filter applications for recruiter's jobs
    const jobIds = jobs.map(j => j._id);
    setMyApps(applications.filter(a => jobIds.includes(a.jobId?._id || a.jobId)));
  }, [jobs, applications]);

  const stats = [
    { label: 'Jobs Posted', value: myJobs.length || jobs.length, icon: Briefcase, color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Total Applicants', value: myApps.length || applications.length, icon: Users, color: '#2563eb', bg: '#dbeafe' },
    { label: 'Interviews Scheduled', value: interviews.length, icon: Calendar, color: '#059669', bg: '#d1fae5' },
    { label: 'Shortlisted', value: (myApps.length ? myApps : applications).filter(a => ['Shortlisted', 'Interview Scheduled'].includes(a.status)).length, icon: TrendingUp, color: '#d97706', bg: '#fef3c7' },
  ];

  const displayJobs = myJobs.length ? myJobs : jobs;
  const displayApps = myApps.length ? myApps : applications;

  return (
    <div>
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage your job postings and applicants</p>
      </div>

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
            <h3 style={{ fontWeight: '700', fontSize: '16px' }}>My Job Postings</h3>
            <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">+ Post Job</Link>
          </div>
          {displayJobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No jobs posted yet. <Link to="/recruiter/post-job" style={{ color: '#7c3aed' }}>Post your first job</Link></p>
            </div>
          ) : (
            displayJobs.slice(0, 5).map(job => (
              <div key={job._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{job.title}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {applications.filter(a => (a.jobId?._id || a.jobId) === job._id).length} applicants • {job.location}
                  </div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Recent Applicants</h3>
            <Link to="/recruiter/applicants" style={{ color: '#7c3aed', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
          </div>
          {displayApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}><p>No applicants yet.</p></div>
          ) : (
            displayApps.slice(0, 5).map(app => {
              const studentName = app.studentId?.userId?.name || 'Student';
              const jobTitle = app.jobId?.title || 'Job';
              return (
                <div key={app._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar" style={{ background: '#ede9fe', color: '#7c3aed', width: '34px', height: '34px', fontSize: '13px' }}>
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{studentName}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{jobTitle}</div>
                    </div>
                  </div>
                  <span className={`badge ${statusColor[app.status] || 'badge-gray'}`} style={{ fontSize: '11px' }}>{app.status}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
