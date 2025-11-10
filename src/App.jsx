import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import StudentsPage from './pages/StudentsPage';
import SeniorsPage from './pages/SeniorsPage';
import DonatorsPage from './pages/DonatorsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RequestsPage from './pages/RequestsPage';

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Protected Route Component - Modified for static demo
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  // For static demo, auto-login if no token
  if (!token) {
    localStorage.setItem('adminToken', 'demo-token');
    localStorage.setItem('adminUser', JSON.stringify({ name: 'Demo User', email: 'demo@example.com' }));
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="seniors" element={<SeniorsPage />} />
              <Route path="donators" element={<DonatorsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="requests" element={<RequestsPage />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
