import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MASTER_DEPARTMENT_LIST } from "../data";

export type DepartmentFormPayload = { name: string };

export function AddDepartmentDialog({
  open,
  isPending = false,
  initialName = "",
  title = "Add a department",
  submitLabel = "Add department",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  isPending?: boolean;
  initialName?: string;
  title?: string;
  submitLabel?: string;
  onCancel: () => void;
  onConfirm: (p: DepartmentFormPayload) => void;
}) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const valid = name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: 480 } }}
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
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Group doctors by clinical area.
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onCancel}
          aria-label="Close"
          disabled={isPending}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          freeSolo
          options={MASTER_DEPARTMENT_LIST}
          inputValue={name}
          onInputChange={(_, v) => setName(v)}
          renderInput={(p) => (
            <TextField
              {...p}
              label="Department name"
              required
              helperText="Pick a common name or type a custom one."
              autoFocus
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm({ name: name.trim() })}
          disabled={!valid || isPending}
        >
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
