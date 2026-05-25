import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MASTER_BED_TYPES } from "../data";

const CUSTOM = "__custom__";

export function ConfigureBedTypeDialog({
  open,
  isPending = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (p: { type: string; total: number; occupied: number }) => void;
}) {
  const [typeChoice, setTypeChoice] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [total, setTotal] = useState(0);
  const [occupied, setOccupied] = useState(0);

  const isCustom = typeChoice === CUSTOM;
  const finalType = isCustom ? customName.trim() : typeChoice;
  const available = total - occupied;
  const valid =
    finalType.length > 0 && total > 0 && occupied >= 0 && occupied <= total;
  const submitting = isPending;
  const handleConfirm = () => onConfirm({ type: finalType, total, occupied });

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: "100%", maxWidth: 480, m: { xs: 2, sm: 4 } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          Configure bed type
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Add a new bed type to your hospital.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          required
          label="Bed type"
          value={typeChoice}
          onChange={(e) => setTypeChoice(e.target.value)}
          sx={{ mb: 2 }}
        >
          {MASTER_BED_TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
          <MenuItem value={CUSTOM}>
            <em>Add custom…</em>
          </MenuItem>
        </TextField>
        {isCustom && (
          <TextField
            label="Custom type name"
            required
            fullWidth
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
            sx={{ mb: 2 }}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          <TextField
            label="Total capacity"
            required
            type="number"
            inputProps={{ min: 0 }}
            value={total}
            onChange={(e) => setTotal(Math.max(0, Number(e.target.value)))}
            helperText="How many beds of this type does your hospital have?"
          />
          <TextField
            label="Occupied (initial)"
            required
            type="number"
            inputProps={{ min: 0, max: total }}
            value={occupied}
            onChange={(e) => setOccupied(Math.max(0, Number(e.target.value)))}
            helperText="Set to current occupancy at the time of configuration."
            error={occupied > total}
          />
        </div>
        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: available > 0 ? "success.main" : "error.main",
            }}
          >
            Available: {available}
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
          {submitting ? "Adding..." : "Add bed type"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
