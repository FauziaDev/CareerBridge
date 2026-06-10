import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText } from 'lucide-react';
import api from '../../services/api';

const statusOptions = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
const statusColor = {
  'Applied': 'badge-blue', 'Under Review': 'badge-yellow',
  'Shortlisted': 'badge-purple', 'Interview Scheduled': 'badge-green',
  'Selected': 'badge-green', 'Rejected': 'badge-red',
};

export default function ViewApplicants() {
  const { jobs, applications, updateApplicationStatus, fetchApplications, fetchJobs } = useApp();
  const [selectedJob, setSelectedJob] = useState('all');
  const [myJobs, setMyJobs] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    api.get('/recruiter/profile').then(({ data }) => {
      const rid = data.recruiter._id;
      setMyJobs(jobs.filter(j => j.recruiterId?._id === rid || j.recruiterId === rid));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/recruiter/profile').then(({ data }) => {
      const rid = data.recruiter._id;
      setMyJobs(jobs.filter(j => j.recruiterId?._id === rid || j.recruiterId === rid));
    }).catch(() => {});
  }, [jobs]);

  const myJobIds = myJobs.map(j => j._id);
  const allApps = applications.filter(a => myJobIds.includes(a.jobId?._id || a.jobId));
  const filtered = selectedJob === 'all' ? allApps : allApps.filter(a => (a.jobId?._id || a.jobId) === selectedJob);

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId);
    await updateApplicationStatus(appId, status);
    setUpdating(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>View Applicants</h1>
        <p>Review and manage candidates for your job postings</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', fontSize: '14px', color: '#475569' }}>Filter by Job:</span>
          <button onClick={() => setSelectedJob('all')} className={`btn btn-sm ${selectedJob === 'all' ? 'btn-primary' : 'btn-gray'}`}>
            All Jobs ({allApps.length})
          </button>
          {myJobs.map(job => (
            <button key={job._id} onClick={() => setSelectedJob(job._id)}
              className={`btn btn-sm ${selectedJob === job._id ? 'btn-primary' : 'btn-gray'}`}>
              {job.title} ({applications.filter(a => (a.jobId?._id || a.jobId) === job._id).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Users size={48} />
          <h3>No applicants yet</h3>
          <p>Applicants will appear here once students apply to your jobs</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied For</th>
                  <th>College</th>
                  <th>Applied Date</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => {
                  const studentName = app.studentId?.userId?.name || 'Student';
                  const studentEmail = app.studentId?.userId?.email || '';
                  const college = app.studentId?.college || '';
                  const jobTitle = app.jobId?.title || 'Job';
                  const resumeUrl = app.resumeUrl || app.studentId?.resumeUrl;
                  return (
                    <tr key={app._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ background: '#ede9fe', color: '#7c3aed', width: '36px', height: '36px', fontSize: '14px' }}>
                            {studentName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{studentName}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#475569' }}>{jobTitle}</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{college || '—'}</td>
                      <td style={{ color: '#64748b' }}>{new Date(app.appliedAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {resumeUrl ? (
                          <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-gray btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <FileText size={13} /> View
                          </a>
                        ) : <span style={{ color: '#94a3b8', fontSize: '13px' }}>—</span>}
                      </td>
                      <td>
                        <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
                      </td>
                      <td>
                        <select
                          value={app.status}
                          disabled={updating === app._id}
                          onChange={e => handleStatusChange(app._id, e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '13px', cursor: 'pointer', background: 'white', color: '#1e293b' }}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
