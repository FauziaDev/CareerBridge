import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Video, MapPin, ExternalLink } from 'lucide-react';

export default function StudentInterviews() {
  const { interviews, fetchInterviews } = useApp();

  useEffect(() => { fetchInterviews(); }, []);

  const upcoming = interviews.filter(i => i.status === 'Scheduled');
  const past = interviews.filter(i => i.status !== 'Scheduled');

  const InterviewCard = ({ iv }) => {
    const jobTitle = iv.applicationId?.jobId?.title || 'Interview';
    const company = iv.applicationId?.jobId?.recruiterId?.companyName || '';
    return (
      <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{jobTitle}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>🏢 {company}</p>
          </div>
          <span className={`badge ${iv.status === 'Scheduled' ? 'badge-green' : iv.status === 'Completed' ? 'badge-blue' : 'badge-gray'}`}>
            {iv.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
            <Calendar size={16} color="#2563eb" />
            <span>{new Date(iv.interviewDate).toLocaleDateString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
            <Clock size={16} color="#7c3aed" />
            <span>{iv.interviewTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
            {iv.mode === 'Online' ? <Video size={16} color="#059669" /> : <MapPin size={16} color="#d97706" />}
            <span>{iv.mode}</span>
          </div>
        </div>
        {iv.notes && <p style={{ marginTop: '10px', color: '#475569', fontSize: '13px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>📝 {iv.notes}</p>}
        {iv.mode === 'Online' && iv.link && (
          <div style={{ marginTop: '14px' }}>
            <a href={iv.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ExternalLink size={14} /> Join Interview
            </a>
          </div>
        )}
        {iv.mode === 'Offline' && (
          <div style={{ marginTop: '12px', background: '#fef3c7', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#92400e' }}>
            📍 Please visit the company office on the scheduled date and time.
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Interviews</h1>
        <p>Track your scheduled and past interviews</p>
      </div>

      {interviews.length === 0 ? (
        <div className="card empty-state">
          <Calendar size={48} />
          <h3>No interviews yet</h3>
          <p>Keep applying to jobs — interviews will appear here once scheduled by recruiters.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                📅 Upcoming Interviews ({upcoming.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {upcoming.map(iv => <InterviewCard key={iv._id} iv={iv} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                ✅ Past Interviews ({past.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {past.map(iv => <InterviewCard key={iv._id} iv={iv} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
