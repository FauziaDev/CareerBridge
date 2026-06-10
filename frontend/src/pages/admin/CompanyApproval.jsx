import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, CheckCircle, XCircle, Globe, Briefcase } from 'lucide-react';

export default function CompanyApproval() {
  const { recruiters, approveRecruiter, fetchAdminData } = useApp();
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(null);

  useEffect(() => { fetchAdminData(); }, []);

  const filtered = filter === 'all' ? recruiters : recruiters.filter(r => r.status === filter);

  const handleAction = async (recruiterId, action) => {
    setLoading(recruiterId + action);
    await approveRecruiter(recruiterId, action);
    setLoading(null);
  };

  const statusBadge = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' };

  return (
    <div>
      <div className="page-header">
        <h1>Company Approval</h1>
        <p>Review and approve recruiter company registrations</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Pending', value: recruiters.filter(r => r.status === 'pending').length, color: '#d97706', bg: '#fef3c7' },
          { label: 'Approved', value: recruiters.filter(r => r.status === 'approved').length, color: '#059669', bg: '#d1fae5' },
          { label: 'Rejected', value: recruiters.filter(r => r.status === 'rejected').length, color: '#dc2626', bg: '#fee2e2' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><Building2 size={22} color={s.color} /></div>
            <div className="stat-info"><h3>{s.value}</h3><p>{s.label} Companies</p></div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ maxWidth: '400px' }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><Building2 size={48} /><h3>No companies in this category</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(r => {
            const companyName = r.companyName || r.userId?.name || 'Company';
            return (
              <div key={r._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#7c3aed', flexShrink: 0 }}>
                      {companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{companyName}</h3>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {r.industry && <span style={{ color: '#64748b', fontSize: '13px' }}>🏭 {r.industry}</span>}
                        {r.website && (
                          <a href={`https://${r.website}`} target="_blank" rel="noreferrer"
                            style={{ color: '#2563eb', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Globe size={12} /> {r.website}
                          </a>
                        )}
                        <span style={{ color: '#64748b', fontSize: '13px' }}>
                          <Briefcase size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {r.jobsPosted?.length || 0} jobs posted
                        </span>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>
                          📧 {r.userId?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`badge ${statusBadge[r.status]}`} style={{ textTransform: 'capitalize' }}>{r.status}</span>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(r._id, 'approve')} disabled={loading === r._id + 'approve'}
                          className="btn btn-success btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle size={14} /> {loading === r._id + 'approve' ? '...' : 'Approve'}
                        </button>
                        <button onClick={() => handleAction(r._id, 'reject')} disabled={loading === r._id + 'reject'}
                          className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <XCircle size={14} /> {loading === r._id + 'reject' ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button onClick={() => handleAction(r._id, 'reject')} className="btn btn-danger btn-sm">Revoke</button>
                    )}
                    {r.status === 'rejected' && (
                      <button onClick={() => handleAction(r._id, 'approve')} className="btn btn-success btn-sm">Re-approve</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
