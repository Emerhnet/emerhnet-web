import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const MIN_LEN = 20;

export function RejectDialog({
  open,
  hospitalName,
  isPending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  hospitalName: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState('');
  const valid = notes.trim().length >= MIN_LEN;

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes('');
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { width: 480 } }}>
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>Reject {hospitalName}?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The hospital will be notified of the rejection. Provide a reason so the applicant can
          take corrective action and re-apply.
        </Typography>
        <TextField
          label="Rejection reason"
          placeholder="Explain why this application is being rejected…"
          multiline
          rows={4}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          error={notes.length > 0 && !valid}
          helperText={notes.length > 0 && !valid ? `At least ${MIN_LEN} characters required` : ''}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={!valid || isPending}>
          {isPending ? 'Rejecting…' : 'Reject application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
