import { useLocation, useNavigate } from 'react-router-dom';
import { useRegistrationStore } from '../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

type LocState = { trackingId?: string; adminEmail?: string };

export function SubmittedStep() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocState | null };
  const reset = useRegistrationStore((s) => s.reset);
  const invite = useRegistrationStore((s) => s.invite);
  const { enqueueSnackbar } = useSnackbar();
  const trackingId = state?.trackingId ?? 'EMR-0000-XXXXXX';
  const adminEmail = state?.adminEmail ?? 'admin@example.org';
  const wasInvited = Boolean(invite);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      enqueueSnackbar('Tracking ID copied.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Copy failed.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 1 }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: '#E8EEF5',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'primary.main' }} />
      </Box>

      <Typography
        variant="h1"
        sx={{ fontSize: 28, fontWeight: 600, color: 'primary.main', mb: 1 }}
      >
        {wasInvited ? 'Registration complete' : 'Application submitted'}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, px: 2 }}>
        {wasInvited ? (
          <>
            Your hospital has been activated. We&apos;ve emailed login credentials to{' '}
            <strong>{adminEmail}</strong>. Use them to sign in and set a new password.
          </>
        ) : (
          <>
            Thank you. The Galas team will review your application and respond within 3 business
            days. We&apos;ve sent a confirmation to {adminEmail}.
          </>
        )}
      </Typography>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#F2EEE6',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          px: 2,
          py: 1.25,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Tracking ID: {trackingId}
        </Typography>
        <Tooltip title="Copy">
          <IconButton size="small" onClick={copyId} aria-label="Copy tracking ID">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Button
          variant="text"
          onClick={() => {
            reset();
            navigate('/register-hospital');
          }}
          sx={{ fontWeight: 500 }}
        >
          Track another application
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            reset();
            navigate('/sign-in');
          }}
          sx={{ height: 44, px: 5, fontWeight: 600 }}
        >
          {wasInvited ? 'Go to sign-in' : 'Done'}
        </Button>
      </Box>
    </Box>
  );
}
