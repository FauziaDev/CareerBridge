import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, CheckCircle, Plus, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function PostJob() {
  const { addJob, fetchJobs, jobs } = useApp();
  const [form, setForm] = useState({ title: '', description: '', location: '', stipend: '', type: 'Internship', applicationDeadline: '', skillsRequired: [] });
  const [newSkill, setNewSkill] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [recruiterStatus, setRecruiterStatus] = useState('');
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    api.get('/recruiter/profile').then(({ data }) => {
      setRecruiterStatus(data.recruiter.status);
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

  const addSkill = () => {
    if (newSkill.trim() && !form.skillsRequired.includes(newSkill.trim())) {
      setForm(f => ({ ...f, skillsRequired: [...f.skillsRequired, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skillsRequired: f.skillsRequired.filter(sk => sk !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await addJob(form);
    if (result.success) {
      setSuccess(true);
      setForm({ title: '', description: '', location: '', stipend: '', type: 'Internship', applicationDeadline: '', skillsRequired: [] });
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Post a Job</h1>
        <p>Create a new job listing to attract the best candidates</p>
      </div>

      {recruiterStatus === 'pending' && (
        <div className="alert alert-info" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} /> Your company is pending admin approval. You can post jobs once approved.
        </div>
      )}
      {recruiterStatus === 'rejected' && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} /> Your company registration was rejected. Contact admin.
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="#7c3aed" /> Job Details
          </h3>
          {success && <div className="alert alert-success"><CheckCircle size={16} /> Job posted successfully!</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Job Description *</label>
              <textarea placeholder="Describe the role, responsibilities..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Location *</label>
                <input type="text" placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {['Internship', 'Full-time', 'Part-time', 'Contract'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Stipend / Salary</label>
                <input type="text" placeholder="e.g. ₹15,000/month" value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Application Deadline *</label>
                <input type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Required Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {form.skillsRequired.map(s => (
                  <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f5f3ff', color: '#7c3aed', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa', padding: 0 }}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input placeholder="Add required skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                <button type="button" onClick={addSkill} className="btn btn-gray btn-sm"><Plus size={14} /></button>
              </div>
            </div>
            <button type="submit" disabled={recruiterStatus !== 'approved'} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Post Job
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>My Posted Jobs ({myJobs.length})</h3>
          {myJobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <Briefcase size={40} />
              <h3>No jobs posted yet</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myJobs.map(job => (
                <div key={job._id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{job.title}</div>
                      <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>📍 {job.location} • 💰 {job.stipend}</div>
                    </div>
                    <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-purple'}`}>{job.type}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {job.skillsRequired?.map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                    Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
