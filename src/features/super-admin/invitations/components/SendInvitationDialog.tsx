import { useEffect, useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const CHECKLIST_ITEMS = [
  "Hospital exists in the public NIN registry or state list.",
  "Official documents inspected (registration certificate, government order if applicable).",
  "Named recipient holds authority to act for the hospital.",
  "Callback placed to the hospital's published number.",
  "No conflicting registration exists in the system.",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "text.secondary",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function SendInvitationDialog({
  open,
  isPending = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (payload: {
    hospitalName: string;
    recipientEmail: string;
    recipientRole: string;
    internalNotes: string;
    verificationNotes: string;
  }) => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(
    CHECKLIST_ITEMS.map(() => false),
  );
  const [verificationNotes, setVerificationNotes] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const submitting = isPending;

  const completedCount = checked.filter(Boolean).length;
  const allChecked = completedCount === CHECKLIST_ITEMS.length;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail);
  const valid = useMemo(
    () =>
      allChecked &&
      verificationNotes.trim().length > 0 &&
      hospitalName.trim().length > 0 &&
      emailValid,
    [allChecked, verificationNotes, hospitalName, emailValid],
  );

  const reset = () => {
    setChecked(CHECKLIST_ITEMS.map(() => false));
    setVerificationNotes("");
    setHospitalName("");
    setRecipientEmail("");
    setRecipientRole("");
    setInternalNotes("");
  };

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleConfirm = () => {
    onConfirm({
      hospitalName,
      recipientEmail,
      recipientRole,
      internalNotes,
      verificationNotes,
    });
  };

  const handleCancel = () => {
    if (submitting) return;
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { width: "100%", maxWidth: 640, m: { xs: 2, sm: 4 }, borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
            Send invitation
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Invite a hospital to enrol on EMERHNET.
          </Typography>
        </Box>
        <IconButton
          onClick={handleCancel}
          size="small"
          sx={{ mt: -0.5, mr: -0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "#FAF8F3",
            p: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <VerifiedUserIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Pre-invitation verification
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Confirm offline verification before sending. This record is stored
            in the audit log.
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={(completedCount / CHECKLIST_ITEMS.length) * 100}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                bgcolor: "#E5E1D8",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "primary.main",
                  borderRadius: 999,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                whiteSpace: "nowrap",
                minWidth: 36,
              }}
            >
              {completedCount} / {CHECKLIST_ITEMS.length}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            {CHECKLIST_ITEMS.map((text, i) => (
              <FormControlLabel
                key={i}
                sx={{
                  alignItems: "flex-start",
                  mx: 0,
                  py: 0.25,
                  "& .MuiFormControlLabel-label": {
                    fontSize: 13,
                    lineHeight: 1.5,
                    pt: "7px",
                  },
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={checked[i]}
                    onChange={(e) => {
                      const next = [...checked];
                      next[i] = e.target.checked;
                      setChecked(next);
                    }}
                  />
                }
                label={text}
              />
            ))}
          </Box>

          <TextField
            label="Verification notes"
            required
            multiline
            rows={3}
            fullWidth
            size="small"
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            helperText="What was verified, which documents were inspected, callback outcome."
            sx={{ bgcolor: "background.paper" }}
          />
        </Box>

        <SectionLabel>Recipient details</SectionLabel>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Hospital name"
            required
            size="small"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            fullWidth
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            label="Recipient email"
            type="email"
            required
            size="small"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            error={recipientEmail.length > 0 && !emailValid}
            helperText={
              recipientEmail.length > 0 && !emailValid
                ? "Enter a valid email"
                : " "
            }
            fullWidth
          />
          <TextField
            label="Recipient role"
            size="small"
            value={recipientRole}
            onChange={(e) => setRecipientRole(e.target.value)}
            placeholder="e.g. Medical Superintendent"
            helperText=" "
            fullWidth
          />
          <TextField
            label="Internal notes"
            multiline
            rows={2}
            size="small"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            helperText="Visible only to the Galas team."
            fullWidth
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={submitting}
          sx={{ fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleConfirm}
          disabled={!valid || submitting}
          sx={{ fontWeight: 600 }}
        >
          {submitting ? "Sending…" : "Send invitation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
