import { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FIELDS = [
  "Hospital Name",
  "NIN",
  "Category",
  "Geo-coordinates",
  "CGHS empanelment",
  "Ayushman Bharat empanelment",
] as const;

type Field = (typeof FIELDS)[number];

const CURRENT_VALUES: Record<Field, string> = {
  "Hospital Name": "General Hospital, Pune",
  NIN: "27-PUN-11111",
  Category: "Government",
  "Geo-coordinates": "18.5276, 73.8744",
  "CGHS empanelment": "Yes",
  "Ayushman Bharat empanelment": "Yes",
};

export function RequestChangeDialog({
  open,
  initialField,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  initialField?: Field;
  onCancel: () => void;
  onConfirm: (payload: {
    field: Field;
    proposed: string;
    reason: string;
    fileName?: string;
  }) => void;
}) {
  const [field, setField] = useState<Field>(initialField ?? "Geo-coordinates");
  const [proposed, setProposed] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = CURRENT_VALUES[field];
  const valid = useMemo(
    () =>
      proposed.trim().length > 0 &&
      proposed.trim() !== current &&
      reason.trim().length > 0,
    [proposed, current, reason],
  );

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    onConfirm({ field, proposed, reason, fileName: file?.name });
    setSubmitting(false);
    setProposed("");
    setReason("");
    setFile(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: 520 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            Request a profile change
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Changes to identity fields require Galas review before they take
            effect.
          </Typography>
        </Box>
        <IconButton size="small" onClick={onCancel} aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          required
          label="Field to change"
          value={field}
          onChange={(e) => {
            setField(e.target.value as Field);
            setProposed("");
          }}
          sx={{ mb: 2 }}
        >
          {FIELDS.map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </TextField>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <TextField
            label="Current value"
            value={current}
            InputProps={{ readOnly: true }}
            sx={{ bgcolor: "#F2EEE6" }}
          />
          <TextField
            label="Proposed value"
            required
            value={proposed}
            onChange={(e) => setProposed(e.target.value)}
            placeholder={
              field === "Geo-coordinates" ? "e.g. 18.5241, 73.8602" : ""
            }
          />
        </div>

        <TextField
          label="Reason for change"
          required
          multiline
          rows={4}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          helperText="Briefly explain why this change is needed. The Galas team uses this when reviewing."
          sx={{ mb: 2 }}
        />

        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>
          Supporting document
        </Typography>
        <Box
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 1,
            p: 3,
            gap: 1,
            transition: "all 120ms",
            "&:hover": { borderColor: "primary.main", bgcolor: "#FAFAFA" },
          }}
        >
          <input
            type="file"
            accept="application/pdf,image/*"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#E8EEF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UploadFileIcon sx={{ color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {file ? file.name : "Click to upload or drag and drop"}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            PDF, JPG or PNG (Max. 5MB)
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!valid || submitting}
        >
          {submitting ? "Submitting..." : "Submit for review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
