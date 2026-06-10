import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, Search } from 'lucide-react';

export default function UserManagement() {
  const { students, recruiters, deleteUser, fetchAdminData } = useApp();
  const [tab, setTab] = useState('students');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchAdminData(); }, []);

  const filteredStudents = students.filter(s => {
    const name = s.userId?.name || '';
    const email = s.userId?.email || '';
    const college = s.college || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      college.toLowerCase().includes(search.toLowerCase());
  });

  const filteredRecruiters = recruiters.filter(r => {
    const name = r.companyName || r.userId?.name || '';
    const industry = r.industry || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      industry.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    await deleteUser(confirmDelete.userId);
    setConfirmDelete(null);
    setDeleting(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage students and recruiter accounts on the platform</p>
      </div>

      <div className="tabs" style={{ maxWidth: '360px', marginBottom: '20px' }}>
        <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
          Students ({students.length})
        </button>
        <button className={`tab ${tab === 'recruiters' ? 'active' : ''}`} onClick={() => setTab('recruiters')}>
          Recruiters ({recruiters.length})
        </button>
      </div>

      <div className="search-bar" style={{ maxWidth: '400px' }}>
        <Search size={16} color="#94a3b8" />
        <input placeholder={`Search ${tab}...`} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '380px' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Trash2 size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Delete User?</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                This action cannot be undone. The user and all their data will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setConfirmDelete(null)} className="btn btn-gray">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'students' ? (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>College</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No students found</td></tr>
                ) : (
                  filteredStudents.map(s => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ background: '#dbeafe', color: '#2563eb', width: '36px', height: '36px', fontSize: '14px' }}>
                            {(s.userId?.name || 'S').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{s.userId?.name}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{s.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '13px' }}>{s.college || '—'}</td>
                      <td style={{ color: '#475569', fontSize: '13px' }}>{s.course || '—'}</td>
                      <td>{s.year ? <span className="badge badge-blue">Year {s.year}</span> : '—'}</td>
                      <td style={{ fontWeight: '600' }}>{s.cgpa || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {(s.skills || []).slice(0, 2).map(sk => <span key={sk} className="tag" style={{ fontSize: '11px' }}>{sk}</span>)}
                          {(s.skills || []).length > 2 && <span className="tag" style={{ fontSize: '11px' }}>+{s.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td>
                        <button onClick={() => setConfirmDelete({ userId: s.userId?._id, name: s.userId?.name })}
                          className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Website</th>
                  <th>Jobs Posted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecruiters.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No recruiters found</td></tr>
                ) : (
                  filteredRecruiters.map(r => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ background: '#f5f3ff', color: '#7c3aed', width: '36px', height: '36px', fontSize: '14px' }}>
                            {(r.companyName || 'R').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{r.companyName}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{r.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '13px' }}>{r.industry || '—'}</td>
                      <td style={{ color: '#2563eb', fontSize: '13px' }}>{r.website || '—'}</td>
                      <td><span className="badge badge-blue">{r.jobsPosted?.length || 0} jobs</span></td>
                      <td>
                        <span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'pending' ? 'badge-yellow' : 'badge-red'}`} style={{ textTransform: 'capitalize' }}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => setConfirmDelete({ userId: r.userId?._id, name: r.companyName })}
                          className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
