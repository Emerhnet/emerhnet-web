import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  BLOOD_GROUPS,
  type ApiBloodStock,
  type BloodGroup,
} from "../../api/bloodbank";

export function BloodStockDialog({
  open,
  mode,
  existingGroups,
  initial,
  isPending = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  mode: "add" | "edit";
  existingGroups: BloodGroup[];
  initial?: ApiBloodStock | null;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (p: {
    bloodGroup: BloodGroup;
    unitsAvailable: number;
    criticalThreshold: number;
  }) => void;
}) {
  const available = BLOOD_GROUPS.filter((g) => !existingGroups.includes(g));
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    available[0] ?? "A+",
  );
  const [units, setUnits] = useState(0);
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setBloodGroup(initial.bloodGroup);
      setUnits(initial.unitsAvailable);
      setThreshold(initial.criticalThreshold);
    } else {
      setBloodGroup(available[0] ?? "A+");
      setUnits(0);
      setThreshold(5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initial]);

  const valid = units >= 0 && threshold >= 0;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { width: "100%", maxWidth: 440, m: { xs: 2, sm: 4 } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {mode === "edit" ? "Update blood stock" : "Add blood stock"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {mode === "add" && (
          <TextField
            select
            label="Blood group"
            required
            fullWidth
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
            sx={{ mb: 2 }}
          >
            {available.length === 0 ? (
              <MenuItem value="" disabled>
                All groups already configured
              </MenuItem>
            ) : (
              available.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))
            )}
          </TextField>
        )}
        {mode === "edit" && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: "#FAF8F3",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontWeight: 500,
              }}
            >
              Blood group
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "primary.main" }}>
              {bloodGroup}
            </Typography>
          </Box>
        )}
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Units available"
            required
            type="number"
            inputProps={{ min: 0 }}
            value={units}
            onChange={(e) => setUnits(Math.max(0, Number(e.target.value)))}
          />
          <TextField
            label="Critical threshold"
            required
            type="number"
            inputProps={{ min: 0 }}
            value={threshold}
            onChange={(e) => setThreshold(Math.max(0, Number(e.target.value)))}
            helperText="Alert below this"
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            onConfirm({
              bloodGroup,
              unitsAvailable: units,
              criticalThreshold: threshold,
            })
          }
          disabled={!valid || isPending || (mode === "add" && available.length === 0)}
        >
          {isPending ? "Saving…" : mode === "edit" ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
