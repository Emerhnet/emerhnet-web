import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export function ConfirmDialog({
  open,
  title,
  body,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmTone = 'primary',
  confirmDisabled = false,
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmTone?: 'primary' | 'danger';
  confirmDisabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { width: 480 } }}>
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={confirmTone === 'danger' ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={confirmDisabled || loading}
        >
          {loading ? 'Working...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
