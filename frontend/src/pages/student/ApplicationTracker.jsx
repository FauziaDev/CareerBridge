import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardList, MapPin, Calendar } from 'lucide-react';

const statusSteps = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];
const statusColor = {
  'Applied': 'badge-blue', 'Under Review': 'badge-yellow',
  'Shortlisted': 'badge-purple', 'Interview Scheduled': 'badge-green',
  'Selected': 'badge-green', 'Rejected': 'badge-red',
};

export default function ApplicationTracker() {
  const { applications, fetchApplications } = useApp();

  useEffect(() => { fetchApplications(); }, []);

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <div>
      <div className="page-header">
        <h1>Application Tracker</h1>
        <p>Track the status of all your job applications</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Applied', value: applications.length, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, color: '#d97706', bg: '#fef3c7' },
          { label: 'Shortlisted', value: applications.filter(a => ['Shortlisted', 'Interview Scheduled'].includes(a.status)).length, color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Selected', value: applications.filter(a => a.status === 'Selected').length, color: '#059669', bg: '#d1fae5' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <ClipboardList size={22} color={s.color} />
            </div>
            <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="card empty-state">
          <ClipboardList size={48} />
          <h3>No applications yet</h3>
          <p>Start applying to jobs to track your progress here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map(app => {
            const job = app.jobId;
            const stepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';
            return (
              <div key={app._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{job?.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>🏢 {job?.recruiterId?.companyName}</span>
                      <span style={{ color: '#64748b', fontSize: '13px' }}><MapPin size={12} style={{ display: 'inline' }} /> {job?.location}</span>
                      <span style={{ color: '#64748b', fontSize: '13px' }}><Calendar size={12} style={{ display: 'inline' }} /> Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
                </div>

                {!isRejected ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      {statusSteps.map((step, i) => (
                        <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 4px',
                            background: i <= stepIdx ? '#2563eb' : '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: i <= stepIdx ? 'white' : '#94a3b8', fontSize: '12px', fontWeight: '700'
                          }}>
                            {i < stepIdx ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: '11px', color: i <= stepIdx ? '#2563eb' : '#94a3b8', fontWeight: i === stepIdx ? '700' : '400' }}>
                            {step.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.max(5, (stepIdx / (statusSteps.length - 1)) * 100)}%` }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '10px 14px', color: '#991b1b', fontSize: '14px' }}>
                    ❌ Application was not selected for this position.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
