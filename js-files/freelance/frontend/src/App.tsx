import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import MessagesPage from './routes/MessagesPage';
import MilestonesPage from './routes/MilestonesPage';
import InvoicesPage from './routes/InvoicesPage';
import ProfilePage from './routes/ProfilePage';
import ProjectDetailPage from './routes/ProjectDetailPage';
import RegisterPage from './routes/RegisterPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import ClientDashboard from './routes/client/ClientDashboard';
import CreateProjectPage from './routes/client/CreateProjectPage';
import ProjectsPage from './routes/client/ProjectsPage';
import BrowseProjectsPage from './routes/freelancer/BrowseProjectsPage';
import FreelancerDashboard from './routes/freelancer/FreelancerDashboard';
import EditProjectPage from './routes/client/EditProjectPage';
import AboutUsPage from './routes/AboutUsPage';
import { userRole } from './AllEnums';
import useAuth from './hooks/useAuth';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

interface RoleBasedRouteProps {
  isAuthenticated: boolean;
  userRole: string;
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RoleBasedRoute = ({ isAuthenticated, userRole, allowedRoles, children }: RoleBasedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  // Redirect to appropriate dashboard based on role
  const DashboardRedirect = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // Use Navigate component for role-based redirection
    if (user.role === userRole.CLIENT) {
      return <Navigate to="/dashboard/client-dashboard" replace />;
    }
    if (user.role === userRole.FREELANCER) {
      return <Navigate to="/dashboard/freelancer-dashboard" replace />;
    }
    
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route 
          path="milestones" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT, userRole.FREELANCER]}
            >
              <MilestonesPage />
            </RoleBasedRoute>
          }
        />
        <Route 
          path="invoices" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT, userRole.FREELANCER]}
            >
              <InvoicesPage />
            </RoleBasedRoute>
          }
        />
        
        {/* Client Routes */}
        <Route 
          path="client-dashboard" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT]}
            >
              <ClientDashboard />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="projects" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT]}
            >
              <ProjectsPage />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="projects/create" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT]}
            >
              <CreateProjectPage />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="projects/edit/:id" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT]}
            >
              <EditProjectPage />
            </RoleBasedRoute>
          } 
        />
        
        {/* Freelancer Routes */}
        <Route 
          path="freelancer-dashboard" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.FREELANCER]}
            >
              <FreelancerDashboard />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="browse-projects" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.FREELANCER]}
            >
              <BrowseProjectsPage />
            </RoleBasedRoute>
          } 
        />
        
        {/* Project Details Page - Nested under dashboard */}
        <Route 
          path="projects/:id" 
          element={
            <RoleBasedRoute 
              isAuthenticated={isAuthenticated}
              userRole={user?.role || ''}
              allowedRoles={[userRole.CLIENT, userRole.FREELANCER]}
            >
              <ProjectDetailPage />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; 