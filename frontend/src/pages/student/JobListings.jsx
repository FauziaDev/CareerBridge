import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, DollarSign, Clock, Briefcase, CheckCircle } from 'lucide-react';

export default function JobListings() {
  const { jobs, applications, applyJob, fetchJobs, fetchApplications } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [applyingId, setApplyingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // IDs of jobs already applied to
  const appliedJobIds = applications.map(a => a.jobId?._id || a.jobId);

  const filtered = jobs.filter(j => {
    const matchSearch = !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.recruiterId?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      j.skillsRequired?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'All' || j.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleApply = async (job) => {
    setApplyingId(job._id);
    setErrorMsg('');
    const result = await applyJob(job._id);
    if (result.success) {
      setSuccessId(job._id);
      setTimeout(() => setSuccessId(null), 3000);
    } else {
      setErrorMsg(result.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
    setApplyingId(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Job Listings</h1>
        <p>{jobs.length} opportunities available for you</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '260px', marginBottom: 0 }}>
          <Search size={16} color="#94a3b8" />
          <input placeholder="Search jobs, companies, skills..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Internship', 'Full-time', 'Part-time', 'Contract'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-gray'} btn-sm`}>{t}</button>
          ))}
        </div>
      </div>

      {errorMsg && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{errorMsg}</div>}
      {successId && <div className="alert alert-success" style={{ marginBottom: '16px' }}><CheckCircle size={16} /> Application submitted!</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div className="card empty-state">
            <Briefcase size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map(job => {
            const isApplied = appliedJobIds.includes(job._id);
            const isApplying = applyingId === job._id;
            return (
              <div key={job._id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>
                  {job.recruiterId?.companyName?.charAt(0) || 'C'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>{job.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>{job.recruiterId?.companyName}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-purple'}`}>{job.type}</span>
                      {isApplied && <span className="badge badge-green"><CheckCircle size={12} /> Applied</span>}
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '14px', margin: '10px 0', lineHeight: '1.5' }}>{job.description}</p>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '13px' }}>
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '13px' }}>
                      <DollarSign size={14} /> {job.stipend || 'Not specified'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '13px' }}>
                      <Clock size={14} /> Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {job.skillsRequired?.map(s => <span key={s} className="tag">{s}</span>)}
                    </div>
                    <button onClick={() => handleApply(job)} disabled={isApplied || isApplying}
                      className={`btn ${isApplied ? 'btn-gray' : 'btn-primary'} btn-sm`}
                      style={{ minWidth: '110px', justifyContent: 'center' }}>
                      {isApplying ? 'Applying...' : isApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
