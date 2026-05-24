import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 500,
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: 1,
          bgcolor: "#F5F2EC",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 14,
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
        <Tooltip title={copied ? "Copied" : "Copy"}>
          <IconButton size="small" onClick={handleCopy}>
            {copied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export function ApprovedCredentialsDialog({
  open,
  hospitalName,
  email,
  tempPassword,
  emailSent,
  onClose,
}: {
  open: boolean;
  hospitalName: string;
  email: string;
  tempPassword: string;
  emailSent: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: 480 } }}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>
        {hospitalName} approved
      </DialogTitle>
      <DialogContent>
        {emailSent ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            A welcome email with sign-in credentials has been sent to the
            Hospital Admin. Keep these as a backup — the password will not be
            retrievable after you close this dialog.
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            The welcome email could not be delivered. Share these credentials
            with the Hospital Admin manually — they are shown only once.
          </Alert>
        )}
        <CopyRow label="Login email" value={email} />
        <CopyRow label="Temporary password" value={tempPassword} />
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mt: 1 }}
        >
          The admin will be required to set a new password on first sign-in.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="contained" onClick={onClose}>
          I&apos;ve copied the credentials
        </Button>
      </DialogActions>
    </Dialog>
  );
}
