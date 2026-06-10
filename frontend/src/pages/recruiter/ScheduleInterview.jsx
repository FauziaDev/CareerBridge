import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle, Video, MapPin } from 'lucide-react';
import api from '../../services/api';

export default function ScheduleInterview() {
  const { applications, jobs, interviews, scheduleInterview, fetchApplications, fetchJobs, fetchInterviews } = useApp();
  const [form, setForm] = useState({ interviewDate: '', interviewTime: '', mode: 'Online', link: '', notes: '' });
  const [selectedApp, setSelectedApp] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [myJobIds, setMyJobIds] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchJobs();
    fetchInterviews();
    api.get('/recruiter/profile').then(({ data }) => {
      const rid = data.recruiter._id;
      const ids = jobs.filter(j => j.recruiterId?._id === rid || j.recruiterId === rid).map(j => j._id);
      setMyJobIds(ids);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/recruiter/profile').then(({ data }) => {
      const rid = data.recruiter._id;
      const ids = jobs.filter(j => j.recruiterId?._id === rid || j.recruiterId === rid).map(j => j._id);
      setMyJobIds(ids);
    }).catch(() => {});
  }, [jobs]);

  // Eligible: applications for my jobs that are not yet scheduled
  const eligibleApps = applications.filter(a => {
    const jobId = a.jobId?._id || a.jobId;
    const alreadyScheduled = interviews.some(iv => (iv.applicationId?._id || iv.applicationId) === a._id);
    return myJobIds.includes(jobId) && !alreadyScheduled && a.status !== 'Rejected' && a.status !== 'Selected';
  });

  const myInterviews = interviews.filter(iv => {
    const app = applications.find(a => a._id === (iv.applicationId?._id || iv.applicationId));
    return app && myJobIds.includes(app.jobId?._id || app.jobId);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) { setError('Please select a candidate'); return; }
    setLoading(true);
    setError('');
    const result = await scheduleInterview(selectedApp, form);
    if (result.success) {
      setSuccess(true);
      setSelectedApp('');
      setForm({ interviewDate: '', interviewTime: '', mode: 'Online', link: '', notes: '' });
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Schedule Interview</h1>
        <p>Set up interviews for shortlisted candidates</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#059669" /> New Interview
          </h3>

          {success && <div className="alert alert-success"><CheckCircle size={16} /> Interview scheduled! Student has been notified.</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {eligibleApps.length === 0 ? (
            <div className="alert alert-info">No eligible candidates. Applications will appear here once students apply to your jobs.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Candidate *</label>
                <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)} required>
                  <option value="">-- Select candidate --</option>
                  {eligibleApps.map(app => {
                    const name = app.studentId?.userId?.name || 'Student';
                    const jobTitle = app.jobId?.title || 'Job';
                    return <option key={app._id} value={app._id}>{name} — {jobTitle}</option>;
                  })}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Interview Date *</label>
                  <input type="date" value={form.interviewDate} onChange={e => setForm({ ...form, interviewDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Interview Time *</label>
                  <input type="time" value={form.interviewTime} onChange={e => setForm({ ...form, interviewTime: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Interview Mode</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Online', 'Offline'].map(m => (
                    <button key={m} type="button" onClick={() => setForm({ ...form, mode: m })}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid', borderColor: form.mode === m ? '#059669' : '#e2e8f0', background: form.mode === m ? '#f0fdf4' : 'white', color: form.mode === m ? '#059669' : '#64748b', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      {m === 'Online' ? <Video size={15} /> : <MapPin size={15} />} {m}
                    </button>
                  ))}
                </div>
              </div>

              {form.mode === 'Online' && (
                <div className="form-group">
                  <label>Meeting Link</label>
                  <input type="url" placeholder="https://meet.google.com/..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </div>
              )}

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea placeholder="Any instructions for the candidate..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>

              <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                {loading ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>Scheduled Interviews ({myInterviews.length})</h3>
          {myInterviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <Calendar size={40} />
              <h3>No interviews scheduled</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myInterviews.map(iv => {
                const app = applications.find(a => a._id === (iv.applicationId?._id || iv.applicationId));
                const studentName = app?.studentId?.userId?.name || 'Student';
                const jobTitle = app?.jobId?.title || 'Job';
                return (
                  <div key={iv._id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{studentName}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{jobTitle}</div>
                      </div>
                      <span className={`badge ${iv.mode === 'Online' ? 'badge-blue' : 'badge-yellow'}`}>{iv.mode}</span>
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontSize: '13px', color: '#475569' }}>
                      <span>📅 {new Date(iv.interviewDate).toLocaleDateString('en-IN')}</span>
                      <span>🕐 {iv.interviewTime}</span>
                    </div>
                    {iv.link && <a href={iv.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', color: '#2563eb', fontSize: '13px' }}>Meeting Link →</a>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
