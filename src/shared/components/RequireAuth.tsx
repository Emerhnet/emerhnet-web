import { Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthStore } from '@/features/auth/store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const location = useLocation();

  if (!isBootstrapped) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
