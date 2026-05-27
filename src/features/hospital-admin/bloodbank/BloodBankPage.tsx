import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PageHeader } from "@/shared/components/PageHeader";
import { formatRelative } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import {
  useBloodBank,
  useCreateBloodStock,
  useUpdateBloodStock,
  useDeleteBloodStock,
  type ApiBloodStock,
  type BloodGroup,
} from "../api/bloodbank";
import { BloodStockDialog } from "./components/BloodStockDialog";

type Tone = "ok" | "low" | "empty";

const TONE: Record<Tone, { bg: string; fg: string; rail: string; label: string; Icon: typeof CheckCircleIcon }> = {
  ok: { bg: "#D1E7DD", fg: "#0F5132", rail: "#0F5132", label: "Sufficient", Icon: CheckCircleIcon },
  low: { bg: "#FFF3CD", fg: "#8B5A00", rail: "#8B5A00", label: "Low stock", Icon: WarningAmberIcon },
  empty: { bg: "#F8D7DA", fg: "#842029", rail: "#842029", label: "Out of stock", Icon: ErrorOutlineIcon },
};

function toneFor(b: ApiBloodStock): Tone {
  if (b.unitsAvailable === 0) return "empty";
  if (b.unitsAvailable <= b.criticalThreshold) return "low";
  return "ok";
}

function StockCard({
  stock,
  onEdit,
  onDelete,
}: {
  stock: ApiBloodStock;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const t = TONE[toneFor(stock)];
  const Icon = t.Icon;

  return (
    <Card
      sx={{
        position: "relative",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 12,
          bottom: 12,
          width: 4,
          borderRadius: 999,
          bgcolor: t.rail,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            bgcolor: t.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BloodtypeIcon sx={{ fontSize: 28, color: t.fg }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>
            {stock.bloodGroup}
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <Icon sx={{ fontSize: 14, color: t.fg }} />
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: t.fg,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {t.label}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label="Actions"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onEdit();
            }}
          >
            Update
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              onDelete();
            }}
            sx={{ color: "error.main" }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography sx={{ fontSize: 36, fontWeight: 700, color: t.fg, lineHeight: 1 }}>
          {stock.unitsAvailable}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          units available
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Threshold: {stock.criticalThreshold}
        </Typography>
        <Tooltip title={new Date(stock.updatedAt).toString()}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatRelative(stock.updatedAt)}
          </Typography>
        </Tooltip>
      </Box>
    </Card>
  );
}

export function BloodBankPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError, refetch } = useBloodBank();
  const createMutation = useCreateBloodStock();
  const updateMutation = useUpdateBloodStock();
  const deleteMutation = useDeleteBloodStock();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ApiBloodStock | null>(null);

  const rows = data?.items ?? [];
  const existingGroups = rows.map((b) => b.bloodGroup);

  const handleCreate = async (p: {
    bloodGroup: BloodGroup;
    unitsAvailable: number;
    criticalThreshold: number;
  }) => {
    try {
      await createMutation.mutateAsync(p);
      enqueueSnackbar(`Added ${p.bloodGroup} stock.`, { variant: "success" });
      setAddOpen(false);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleUpdate = async (p: {
    bloodGroup: BloodGroup;
    unitsAvailable: number;
    criticalThreshold: number;
  }) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({
        id: editing.id,
        input: {
          unitsAvailable: p.unitsAvailable,
          criticalThreshold: p.criticalThreshold,
        },
      });
      enqueueSnackbar(`Updated ${editing.bloodGroup} stock.`, { variant: "success" });
      setEditing(null);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleDelete = async (b: ApiBloodStock) => {
    if (!window.confirm(`Delete ${b.bloodGroup} stock entry?`)) return;
    try {
      await deleteMutation.mutateAsync(b.id);
      enqueueSnackbar(`Deleted ${b.bloodGroup}.`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  return (
    <>
      <PageHeader
        title="Blood Bank"
        subtitle="Available blood units per group. Update as stock changes."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            disabled={existingGroups.length >= 8}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Add Blood Group
          </Button>
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Total Units
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700 }}>
            {data?.totals.totalUnits ?? 0}
          </Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Low Stock Groups
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#8B5A00" }}>
            {data?.totals.criticalCount ?? 0}
          </Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Out Of Stock
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#842029" }}>
            {data?.totals.emptyCount ?? 0}
          </Typography>
        </Card>
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
        >
          Failed to load blood bank.
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 320px))",
            gap: 2,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={180} />
          ))}
        </Box>
      ) : rows.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <BloodtypeIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5 }}>
            No blood stock configured
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Add a blood group to start tracking units.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ fontWeight: 600 }}
          >
            Add Blood Group
          </Button>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 320px))",
            gap: 2,
            justifyContent: "start",
          }}
        >
          {rows.map((b) => (
            <StockCard
              key={b.id}
              stock={b}
              onEdit={() => setEditing(b)}
              onDelete={() => void handleDelete(b)}
            />
          ))}
        </Box>
      )}

      <BloodStockDialog
        open={addOpen}
        mode="add"
        existingGroups={existingGroups}
        isPending={createMutation.isPending}
        onCancel={() => setAddOpen(false)}
        onConfirm={handleCreate}
      />
      <BloodStockDialog
        open={Boolean(editing)}
        mode="edit"
        existingGroups={[]}
        initial={editing}
        isPending={updateMutation.isPending}
        onCancel={() => setEditing(null)}
        onConfirm={handleUpdate}
      />
    </>
  );
}
