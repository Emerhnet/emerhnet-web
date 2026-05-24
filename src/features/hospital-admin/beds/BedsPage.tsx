import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import HotelIcon from "@mui/icons-material/Hotel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KingBedIcon from "@mui/icons-material/KingBed";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { PageHeader } from "@/shared/components/PageHeader";
import { formatRelative, formatIst } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import {
  useBeds,
  useCreateBed,
  useUpdateBed,
  useDeleteBed,
  type ApiBed,
} from "../api/beds";
import { UpdateBedCountsDialog } from "./components/UpdateBedCountsDialog";
import { ConfigureBedTypeDialog } from "./components/ConfigureBedTypeDialog";

function OccupancyBar({
  occupied,
  total,
}: {
  occupied: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : (occupied / total) * 100;
  const tone: "normal" | "warning" | "danger" =
    pct > 90 ? "danger" : pct >= 70 ? "warning" : "normal";
  const color =
    tone === "danger" ? "#842029" : tone === "warning" ? "#8B5A00" : "#0F5132";
  const trackColor =
    tone === "danger" ? "#F8D7DA" : tone === "warning" ? "#FFF3CD" : "#E5E7EB";
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          flex: 1,
          height: 8,
          bgcolor: trackColor,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${Math.min(pct, 100)}%`,
            height: "100%",
            bgcolor: color,
            borderRadius: 999,
            transition: "width 240ms",
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color,
          minWidth: 36,
          textAlign: "right",
        }}
      >
        {Math.round(pct)}%
      </Typography>
    </Box>
  );
}

type SummaryTone = "primary" | "info" | "success";
const SUMMARY_TONE: Record<
  SummaryTone,
  { bg: string; iconColor: string; valueColor: string }
> = {
  primary: { bg: "#E8EEF5", iconColor: "#0B2545", valueColor: "#0B2545" },
  info: { bg: "#CFE2FF", iconColor: "#0B5394", valueColor: "#0B5394" },
  success: { bg: "#D1E7DD", iconColor: "#0F5132", valueColor: "#0F5132" },
};

function SummaryCard({
  label,
  value,
  Icon,
  tone,
  hint,
}: {
  label: string;
  value: number;
  Icon: typeof HotelIcon;
  tone: SummaryTone;
  hint?: string;
}) {
  const t = SUMMARY_TONE[tone];
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 220,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        p: 2.5,
        pl: 3,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 12,
          bottom: 12,
          width: 4,
          borderRadius: 999,
          bgcolor: t.iconColor,
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1.5,
          bgcolor: t.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ color: t.iconColor, fontSize: 28 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.1,
            color: t.valueColor,
            mt: 0.25,
          }}
        >
          {value}
        </Typography>
        {hint && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
            {hint}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

function AvailablePill({ value }: { value: number }) {
  const zero = value === 0;
  return (
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 600,
        color: zero ? "#842029" : "#0F5132",
      }}
    >
      {value}
    </Typography>
  );
}

function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label="Actions"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onEdit();
          }}
        >
          Edit counts
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          Delete type
        </MenuItem>
      </Menu>
    </>
  );
}

export function BedsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError, refetch } = useBeds();
  const createMutation = useCreateBed();
  const updateMutation = useUpdateBed();
  const deleteMutation = useDeleteBed();

  const [editing, setEditing] = useState<ApiBed | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const rows = data?.items ?? [];
  const total = data?.totals.total ?? 0;
  const occupied = data?.totals.occupied ?? 0;
  const available = total - occupied;

  const handleCreate = async (p: {
    type: string;
    total: number;
    occupied: number;
  }) => {
    try {
      await createMutation.mutateAsync(p);
      enqueueSnackbar(`Added "${p.type}" with ${p.total} beds.`, {
        variant: "success",
      });
      setConfigOpen(false);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleUpdate = async (p: { total: number; occupied: number }) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, input: p });
      enqueueSnackbar(`Updated ${editing.type} counts.`, {
        variant: "success",
      });
      setEditing(null);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleDelete = async (bed: ApiBed) => {
    if (!window.confirm(`Delete bed type "${bed.type}"?`)) return;
    try {
      await deleteMutation.mutateAsync(bed.id);
      enqueueSnackbar(`Deleted ${bed.type}.`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const columns: GridColDef<ApiBed>[] = [
    {
      field: "type",
      headerName: "Bed Type",
      flex: 1.3,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: "#E8EEF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <KingBedIcon sx={{ fontSize: 20, color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {row.type}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 0.5,
      minWidth: 80,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          {row.total}
        </Typography>
      ),
    },
    {
      field: "occupied",
      headerName: "Occupied",
      type: "number",
      flex: 0.6,
      minWidth: 90,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {row.occupied}
        </Typography>
      ),
    },
    {
      field: "available",
      headerName: "Available",
      flex: 0.6,
      minWidth: 90,
      align: "left",
      headerAlign: "left",
      sortable: false,
      renderCell: ({ row }) => (
        <AvailablePill value={row.total - row.occupied} />
      ),
    },
    {
      field: "occupancy",
      headerName: "Occupancy",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => (
        <OccupancyBar occupied={row.occupied} total={row.total} />
      ),
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Tooltip title={formatIst(row.updatedAt)}>
          <span>{formatRelative(row.updatedAt)}</span>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.4,
      minWidth: 80,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <RowMenu
          onEdit={() => setEditing(row)}
          onDelete={() => void handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Beds"
        subtitle="Configure bed types and update occupancy."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setConfigOpen(true)}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Configure Bed Type
          </Button>
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <SummaryCard
          label="Total Beds"
          value={total}
          Icon={HotelIcon}
          tone="primary"
          hint={`Across ${rows.length} bed types`}
        />
        <SummaryCard
          label="Currently Occupied"
          value={occupied}
          Icon={PeopleAltIcon}
          tone="info"
          hint={
            total > 0
              ? `${Math.round((occupied / total) * 100)}% utilization`
              : ""
          }
        />
        <SummaryCard
          label="Available"
          value={available}
          Icon={CheckCircleOutlineIcon}
          tone="success"
          hint="Ready for admission"
        />
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load beds.
        </Alert>
      )}

      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={64} sx={{ mb: 1 }} />
          ))}
        </Card>
      ) : (
        <Card sx={{ overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={72}
            getRowId={(r) => r.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 20, page: 0 } },
            }}
            pageSizeOptions={[20, 50, 100]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 13,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "text.secondary",
              },
              "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
              "& .MuiDataGrid-row:hover": { bgcolor: "#FAFAFA" },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        </Card>
      )}

      <UpdateBedCountsDialog
        open={Boolean(editing)}
        row={editing}
        isPending={updateMutation.isPending}
        onCancel={() => setEditing(null)}
        onConfirm={handleUpdate}
      />
      <ConfigureBedTypeDialog
        open={configOpen}
        isPending={createMutation.isPending}
        onCancel={() => setConfigOpen(false)}
        onConfirm={handleCreate}
      />
    </>
  );
}
