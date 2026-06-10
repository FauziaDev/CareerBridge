import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Briefcase, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, loading } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
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
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Briefcase size={32} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>CareerBridge</h1>
          <p style={{ color: '#94a3b8', marginTop: '6px' }}>Empowering Students with Smarter Careers</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>Welcome back</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Sign in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" placeholder="Enter your email"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: '38px' }} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: '38px', paddingRight: '40px' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '14px', textAlign: 'center', fontWeight: '600', letterSpacing: '0.5px' }}>
            🚀 Quick Demo Login
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { role: 'Student',   email: 'student@demo.com',           password: 'demo123',  color: '#2563eb', bg: 'rgba(37,99,235,0.15)',  icon: '🎓' },
              { role: 'Recruiter', email: 'recruiter@demo.com',         password: 'demo123',  color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', icon: '🏢' },
              { role: 'Admin',     email: 'admin@careerbridge.com',     password: 'admin123', color: '#dc2626', bg: 'rgba(220,38,38,0.15)',  icon: '⚙️' },
            ].map(acc => (
              <button
                key={acc.role}
                onClick={() => setForm({ email: acc.email, password: acc.password })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '10px', border: `1px solid ${acc.color}40`,
                  background: acc.bg, cursor: 'pointer', transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{acc.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{acc.role}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{acc.email}</div>
                  </div>
                </div>
                <div style={{ color: acc.color, fontSize: '12px', fontWeight: '600', background: `${acc.color}20`, padding: '4px 10px', borderRadius: '20px' }}>
                  demo123
                </div>
              </button>
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
            Click any card to auto-fill credentials, then press Sign In
          </p>
        </div>
      </div>
    </div>
  );
}
