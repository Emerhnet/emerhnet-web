import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { StatusChip } from "@/shared/components/StatusChip";

export type BedRow = {
  id: string;
  type: string;
  total: number;
  occupied: number;
};

export function UpdateBedCountsDialog({
  open,
  row,
  isPending = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  row: BedRow | null;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (p: { total: number; occupied: number }) => void;
}) {
  const [total, setTotal] = useState(0);
  const [occupied, setOccupied] = useState(0);

  useEffect(() => {
    if (row) {
      setTotal(row.total);
      setOccupied(row.occupied);
    }
  }, [row]);

  const available = total - occupied;
  const valid = total >= 0 && occupied >= 0 && occupied <= total;
  const submitting = isPending;
  const handleConfirm = () => onConfirm({ total, occupied });

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: 480 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          Update bed counts
        </Typography>
        <Box sx={{ mt: 1 }}>
          {row && <StatusChip label={row.type} tone="primary" />}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <TextField
            label="Total"
            required
            type="number"
            inputProps={{ min: 0 }}
            value={total}
            onChange={(e) => setTotal(Math.max(0, Number(e.target.value)))}
          />
          <TextField
            label="Occupied"
            required
            type="number"
            inputProps={{ min: 0, max: total }}
            value={occupied}
            onChange={(e) => setOccupied(Math.max(0, Number(e.target.value)))}
            error={occupied > total}
            helperText={occupied > total ? "Occupied cannot exceed total." : ""}
          />
        </div>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: available > 0 ? "success.main" : "error.main",
            mt: 2,
            mb: 1.5,
          }}
        >
          Available: {available}
        </Typography>
        <Alert severity="info" icon={false} sx={{ fontSize: 13 }}>
          Updates are recorded in the audit log.
        </Alert>
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
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
