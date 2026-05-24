import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function ApproveDialog({
  open,
  hospitalName,
  adminEmail,
  isPending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  hospitalName: string;
  adminEmail: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes("");
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: 480 } }}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>
        Approve {hospitalName}?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          On approval, the system will:
        </Typography>
        <Box
          component="ul"
          sx={{ pl: 3, m: 0, mb: 2, "& li": { mb: 0.5, fontSize: 14 } }}
        >
          <li>
            Set the hospital's status to <strong>Approved</strong>
          </li>
          <li>
            Create a Hospital Admin account for{" "}
            <Box
              component="code"
              sx={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}
            >
              {adminEmail}
            </Box>
          </li>
          <li>Record the approval in the audit log</li>
        </Box>
        <TextField
          label="Approval notes"
          placeholder="Internal notes — visible to Galas only"
          multiline
          rows={3}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? "Approving…" : "Approve and notify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
