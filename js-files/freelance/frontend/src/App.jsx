import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import HomePage from '@routes/HomePage';
import LoginPage from '@routes/LoginPage';
import RegisterPage from '@routes/RegisterPage';
import DashboardLayout from '@components/layouts/DashboardLayout';
import ClientDashboard from '@routes/client/Dashboard';
import FreelancerDashboard from '@routes/freelancer/Dashboard';
import ProfilePage from '@routes/ProfilePage';
import ProjectsPage from '@routes/client/ProjectsPage';
import CreateProjectPage from '@routes/client/CreateProjectPage'; 
import ProjectDetailPage from '@routes/ProjectDetailPage';
import BrowseProjectsPage from '@routes/freelancer/BrowseProjectsPage';
import MessagesPage from '@routes/MessagesPage';
import MilestonesPage from '@routes/MilestonesPage';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            user?.role === 'client' 
              ? <ClientDashboard /> 
              : <FreelancerDashboard />
          } 
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="milestones" element={<MilestonesPage />} />
        
        {/* Client Routes */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/create" element={<CreateProjectPage />} />
        
        {/* Freelancer Routes */}
        <Route path="browse-projects" element={<BrowseProjectsPage />} />
      </Route>
      
      <Route 
        path="/projects/:id" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProjectDetailPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App; 