import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { TooltipProvider } from '@/components/ui/tooltip';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import { useTheme } from '@/hooks/useTheme';

export default function App() {
  const theme = useTheme();
  const isDark = useSelector((state: RootState) => state.ui.theme === 'dark');

  return (
    <TooltipProvider delayDuration={0}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#fff' : '#1e293b',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: isDark ? '#fff' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#fff' : '#ffffff',
            },
          },
        }}
      />
    </TooltipProvider>
  );
}
