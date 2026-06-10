import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Shared data ───────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Admin data ────────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [adminStats, setAdminStats] = useState({});

  // ── UI state ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ═══════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setJobs([]); setApplications([]); setInterviews([]);
    setNotifications([]); setStudents([]); setRecruiters([]);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // JOBS
  // ═══════════════════════════════════════════════════════════════
  const fetchJobs = useCallback(async (params = {}) => {
    try {
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
    } catch (err) {
      console.error('fetchJobs error:', err.message);
    }
  }, []);

  const addJob = async (jobData) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      setJobs(prev => [data.job, ...prev]);
      return { success: true, job: data.job };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to post job' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // APPLICATIONS
  // ═══════════════════════════════════════════════════════════════
  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data.applications);
    } catch (err) {
      console.error('fetchApplications error:', err.message);
    }
  }, []);

  const applyJob = async (jobId) => {
    try {
      const { data } = await api.post(`/applications/apply/${jobId}`);
      await fetchApplications();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to apply' };
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // INTERVIEWS
  // ═══════════════════════════════════════════════════════════════
  const fetchInterviews = useCallback(async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data.interviews);
    } catch (err) {
      console.error('fetchInterviews error:', err.message);
    }
  }, []);

  const scheduleInterview = async (applicationId, interviewData) => {
    try {
      const { data } = await api.post(`/interviews/${applicationId}`, interviewData);
      await fetchInterviews();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to schedule' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
    } catch (err) {
      console.error('fetchNotifications error:', err.message);
    }
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err.message);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════
  const fetchAdminData = useCallback(async () => {
    try {
      const [usersRes, statsRes, companiesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
        api.get('/admin/companies'),
      ]);
      setStudents(usersRes.data.students);
      setRecruiters(companiesRes.data.companies);
      setAdminStats(statsRes.data.stats);
    } catch (err) {
      console.error('fetchAdminData error:', err.message);
    }
  }, []);

  const approveRecruiter = async (recruiterId, action) => {
    try {
      await api.post('/admin/approve-company', { recruiterId, action });
      setRecruiters(prev => prev.map(r =>
        r._id === recruiterId ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/delete-user/${userId}`);
      await fetchAdminData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // STUDENT PROFILE
  // ═══════════════════════════════════════════════════════════════
  const updateStudentProfile = async (profileData) => {
    try {
      const { data } = await api.put('/student/profile', profileData);
      return { success: true, student: data.student };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update profile' };
    }
  };

  const uploadResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, resumeUrl: data.resumeUrl };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Upload failed' };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // AUTO-FETCH on login
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!currentUser) return;
    fetchJobs();
    fetchNotifications();
    if (currentUser.role === 'student') {
      fetchApplications();
      fetchInterviews();
    }
    if (currentUser.role === 'recruiter') {
      fetchApplications();
      fetchInterviews();
    }
    if (currentUser.role === 'admin') {
      fetchApplications();
      fetchAdminData();
    }
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      // auth
      currentUser, login, logout, register, forgotPassword, loading, error, setError,
      // jobs
      jobs, fetchJobs, addJob,
      // applications
      applications, fetchApplications, applyJob, updateApplicationStatus,
      // interviews
      interviews, fetchInterviews, scheduleInterview,
      // notifications
      notifications, fetchNotifications, markNotificationRead, markAllRead,
      // admin
      students, recruiters, adminStats, fetchAdminData, approveRecruiter, deleteUser,
      // student
      updateStudentProfile, uploadResume,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
