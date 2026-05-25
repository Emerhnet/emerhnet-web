import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const MIN_LEN = 30;
const MAX_LEN = 500;

export function SuspendDialog({
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
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  const len = reason.length;
  const valid = len >= MIN_LEN && len <= MAX_LEN;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: "100%", maxWidth: 480, m: { xs: 2, sm: 4 } } }}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>
        Suspend {hospitalName}?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          While suspended, the Hospital Admin will be unable to sign in. All
          hospital data is preserved and will be available again upon
          reinstatement. The hospital and its administrator will be notified by
          email.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: 2,
            mb: 2,
            bgcolor: "#F8D7DA",
            borderRadius: 1,
          }}
        >
          <WarningAmberIcon sx={{ color: "#842029", flexShrink: 0 }} />
          <Box sx={{ color: "#842029" }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
              Suspension Consequences:
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 2.5, m: 0, "& li": { fontSize: 13, mb: 0.25 } }}
            >
              <li>All active hospital login sessions will be terminated.</li>
              <li>
                The hospital will no longer appear in search results for
                citizens.
              </li>
              <li>Staff cannot update bed availability or patient records.</li>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mb: 0.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="label"
            htmlFor="suspendReason"
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Reason for suspension <span style={{ color: "#842029" }}>*</span>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: len > MAX_LEN ? "error.main" : "text.secondary" }}
          >
            {len} / {MAX_LEN}
          </Typography>
        </Box>
        <TextField
          id="suspendReason"
          multiline
          rows={4}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, MAX_LEN))}
          placeholder="Provide a detailed reason…"
          error={len > 0 && len < MIN_LEN}
          helperText={
            len > 0 && len < MIN_LEN
              ? `Need at least ${MIN_LEN} characters (${MIN_LEN - len} more).`
              : "This reason is recorded in the audit log and is included in the email to the hospital admin."
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={!valid || isPending}
        >
          {isPending ? "Suspending…" : "Suspend hospital"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
