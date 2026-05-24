import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { PublicShell } from '@/shared/layouts/PublicShell';

export function AccountLockedPage() {
  const navigate = useNavigate();

  return (
    <PublicShell>
      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: '#FFF3CD',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <ReportProblemIcon sx={{ fontSize: 36, color: 'warning.main' }} />
        </Box>
        <Typography
          variant="h2"
          sx={{ fontSize: 20, fontWeight: 600, color: 'primary.main', mb: 1.5 }}
        >
          Too many sign-in attempts
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          For your security, we've temporarily blocked sign-ins to this account. Please try again in
          15 minutes, or reset your password.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/forgot-password')}
          sx={{ height: 44, fontWeight: 600, mb: 1.5 }}
        >
          Reset password
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/sign-in')}
          sx={{ height: 44, fontWeight: 600 }}
        >
          Back to sign in
        </Button>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          Need immediate assistance?{' '}
          <Typography
            component="a"
            href="mailto:support@emerhnet.gov.in"
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none' }}
          >
            Contact support
          </Typography>
        </Typography>
      </Box>
    </PublicShell>
  );
}
