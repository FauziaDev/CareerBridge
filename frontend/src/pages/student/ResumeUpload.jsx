import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, FileText, CheckCircle, User, Code, Plus, X } from 'lucide-react';
import api from '../../services/api';

export default function ResumeUpload() {
  const { currentUser, updateStudentProfile, uploadResume } = useApp();
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [profile, setProfile] = useState({ college: '', course: '', year: '1', cgpa: '', bio: '', skills: [] });
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/student/profile');
        const s = data.student;
        setProfile({
          college: s.college || '',
          course: s.course || '',
          year: String(s.year || 1),
          cgpa: String(s.cgpa || ''),
          bio: s.bio || '',
          skills: s.skills || [],
        });
        if (s.resumeUrl) { setUploaded(true); setFileName(s.resumeUrl.split('/').pop()); }
      } catch (_) {}
    };
    fetchProfile();
  }, []);

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') { setUploadError('Only PDF files allowed'); return; }
    setUploadError('');
    const result = await uploadResume(file);
    if (result.success) {
      setFileName(file.name);
      setUploaded(true);
    } else {
      setUploadError(result.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (s) => setProfile(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }));

  const handleSave = async () => {
    setLoading(true);
    setSaveError('');
    const result = await updateStudentProfile({ ...profile, year: Number(profile.year), cgpa: Number(profile.cgpa) });
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Resume & Profile</h1>
        <p>Upload your resume and complete your profile to attract recruiters</p>
      </div>

      <div className="grid-2">
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#2563eb" /> Upload Resume
            </h3>
            {uploadError && <div className="alert alert-error">{uploadError}</div>}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? '#2563eb' : uploaded ? '#10b981' : '#cbd5e1'}`,
                borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
                background: dragging ? '#eff6ff' : uploaded ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s', cursor: 'pointer'
              }}
              onClick={() => document.getElementById('resumeInput').click()}
            >
              <input id="resumeInput" type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])} />
              {uploaded ? (
                <>
                  <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: '600', color: '#065f46', fontSize: '15px' }}>Resume Uploaded!</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{fileName}</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}
                    onClick={e => { e.stopPropagation(); setUploaded(false); setFileName(''); }}>
                    Replace
                  </button>
                </>
              ) : (
                <>
                  <Upload size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>Drop your resume here</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>or click to browse</p>
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>PDF only, max 5MB</p>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="#7c3aed" /> Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {profile.skills.map(s => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', padding: 0 }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <button onClick={addSkill} className="btn btn-primary btn-sm"><Plus size={14} /></button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#059669" /> Academic Profile
          </h3>
          {saved && <div className="alert alert-success"><CheckCircle size={16} /> Profile saved!</div>}
          {saveError && <div className="alert alert-error">{saveError}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={currentUser?.name || ''} readOnly style={{ background: '#f8fafc' }} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={currentUser?.email || ''} readOnly style={{ background: '#f8fafc' }} />
          </div>
          <div className="form-group">
            <label>College / University</label>
            <input type="text" placeholder="e.g. IIT Patna" value={profile.college} onChange={e => setProfile({ ...profile, college: e.target.value })} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Course</label>
              <input type="text" placeholder="e.g. B.Tech CSE" value={profile.course} onChange={e => setProfile({ ...profile, course: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Year</label>
              <select value={profile.year} onChange={e => setProfile({ ...profile, year: e.target.value })}>
                {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>CGPA</label>
            <input type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.5" value={profile.cgpa} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bio / About</label>
            <textarea placeholder="Tell recruiters about yourself..." value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} />
          </div>
          <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
