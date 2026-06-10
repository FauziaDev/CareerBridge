import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Briefcase, User, Building2 } from 'lucide-react';

export default function Register() {
  const { register, loading } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student', companyName: '', industry: '', website: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    const payload = {
      name: form.role === 'recruiter' ? form.companyName || form.name : form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      ...(form.role === 'recruiter' && { companyName: form.companyName, industry: form.industry, website: form.website }),
    };

    const result = await register(payload);
    if (result.success) {
      navigate(`/${result.role}/dashboard`);
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Briefcase size={28} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700' }}>CareerBridge</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Create your account</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>Register</h2>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Role Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>I am a</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['student', 'recruiter'].map(r => (
                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px', border: '2px solid',
                    borderColor: form.role === r ? '#2563eb' : '#e2e8f0',
                    background: form.role === r ? '#eff6ff' : 'white',
                    color: form.role === r ? '#2563eb' : '#64748b',
                    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                  {r === 'student' ? <User size={16} /> : <Building2 size={16} />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            {form.role === 'recruiter' && (
              <>
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" placeholder="Enter company name"
                    value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Industry</label>
                    <input type="text" placeholder="e.g. IT Services"
                      value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="text" placeholder="company.com"
                      value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
              </div>
            </div>

            {form.role === 'recruiter' && (
              <div className="alert alert-info" style={{ fontSize: '13px' }}>
                ℹ️ Recruiter accounts need admin approval before posting jobs.
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '4px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
