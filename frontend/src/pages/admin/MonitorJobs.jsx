import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Search, MapPin, Clock, Users } from 'lucide-react';

export default function MonitorJobs() {
  const { jobs, applications, fetchJobs, fetchApplications } = useApp();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchJobs(); fetchApplications(); }, []);

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.recruiterId?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Monitor Jobs</h1>
        <p>Overview of all active job postings on the platform</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Jobs', value: jobs.length, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Internships', value: jobs.filter(j => j.type === 'Internship').length, color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Full-time', value: jobs.filter(j => j.type === 'Full-time').length, color: '#059669', bg: '#d1fae5' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><Briefcase size={22} color={s.color} /></div>
            <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="search-bar" style={{ maxWidth: '400px' }}>
        <Search size={16} color="#94a3b8" />
        <input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Stipend</th>
                <th>Deadline</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No jobs found</td></tr>
              ) : (
                filtered.map(job => {
                  const appCount = applications.filter(a => (a.jobId?._id || a.jobId) === job._id).length;
                  return (
                    <tr key={job._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{job.title}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                          {job.skillsRequired?.slice(0, 2).map(s => <span key={s} className="tag" style={{ fontSize: '11px' }}>{s}</span>)}
                        </div>
                      </td>
                      <td style={{ fontWeight: '500' }}>{job.recruiterId?.companyName}</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</div>
                      </td>
                      <td><span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-purple'}`}>{job.type}</span></td>
                      <td style={{ color: '#059669', fontWeight: '500', fontSize: '13px' }}>{job.stipend || '—'}</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                          <Users size={14} color="#64748b" /> {appCount}
                        </div>
                      </td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
