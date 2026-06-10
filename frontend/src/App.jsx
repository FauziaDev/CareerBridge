import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Layout
import Layout from './components/Layout';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import JobListings from './pages/student/JobListings';
import ApplicationTracker from './pages/student/ApplicationTracker';
import ResumeUpload from './pages/student/ResumeUpload';
import StudentInterviews from './pages/student/StudentInterviews';

// Recruiter
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import ScheduleInterview from './pages/recruiter/ScheduleInterview';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CompanyApproval from './pages/admin/CompanyApproval';
import UserManagement from './pages/admin/UserManagement';
import MonitorJobs from './pages/admin/MonitorJobs';

// Shared
import Notifications from './pages/shared/Notifications';

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute role="student"><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="jobs" element={<JobListings />} />
        <Route path="applications" element={<ApplicationTracker />} />
        <Route path="resume" element={<ResumeUpload />} />
        <Route path="interviews" element={<StudentInterviews />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Recruiter */}
      <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="applicants" element={<ViewApplicants />} />
        <Route path="interviews" element={<ScheduleInterview />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="companies" element={<CompanyApproval />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="jobs" element={<MonitorJobs />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
