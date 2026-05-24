import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BuildIcon from "@mui/icons-material/Build";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusChip } from "@/shared/components/StatusChip";
import { formatRelative } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { AMBULANCE_TYPE_INFO, STATUS_TONE } from "./data";
import {
  useAmbulances,
  useCreateAmbulance,
  useUpdateAmbulance,
  useDeleteAmbulance,
  type ApiAmbulance,
  type AmbulanceStatus,
  type AmbulanceType,
  type CreateAmbulanceInput,
} from "../api/ambulances";
import { RegisterAmbulanceDrawer } from "./components/RegisterAmbulanceDrawer";

const TYPE_KEYS = Object.keys(AMBULANCE_TYPE_INFO) as AmbulanceType[];
const STATUS_KEYS: AmbulanceStatus[] = [
  "Available",
  "On Duty",
  "Under Maintenance",
  "Out of Service",
];

const PILL_TONE: Record<
  AmbulanceStatus,
  { bg: string; fg: string; rail: string; Icon: typeof CheckCircleIcon }
> = {
  Available: {
    bg: "#D1E7DD",
    fg: "#0F5132",
    rail: "#0F5132",
    Icon: CheckCircleIcon,
  },
  "On Duty": {
    bg: "#CFE2FF",
    fg: "#0B5394",
    rail: "#0B5394",
    Icon: DirectionsRunIcon,
  },
  "Under Maintenance": {
    bg: "#FFF3CD",
    fg: "#8B5A00",
    rail: "#8B5A00",
    Icon: BuildIcon,
  },
  "Out of Service": {
    bg: "#F8D7DA",
    fg: "#842029",
    rail: "#842029",
    Icon: CancelIcon,
  },
};

function StatusPill({
  label,
  count,
}: {
  label: AmbulanceStatus;
  count: number;
}) {
  const t = PILL_TONE[label];
  const dim = count === 0;
  const Icon = t.Icon;
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 200,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        pl: 2.5,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 8,
          bottom: 8,
          width: 4,
          borderRadius: 999,
          bgcolor: t.rail,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          bgcolor: t.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ color: t.fg, fontSize: 22 }} />
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
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.1,
            color: dim ? "text.disabled" : t.fg,
            mt: 0.25,
          }}
        >
          {String(count).padStart(2, "0")}
        </Typography>
      </Box>
    </Card>
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
          Edit
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
    </>
  );
}

export function AmbulancesPage() {
  const [params, setParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<ApiAmbulance | null>(null);

  const q = params.get("q") ?? "";
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useAmbulances({
    search: q || undefined,
    type: type || undefined,
    status: status || undefined,
  });

  const createMutation = useCreateAmbulance();
  const updateMutation = useUpdateAmbulance();
  const deleteMutation = useDeleteAmbulance();

  const rows = data?.items ?? [];

  const counts = useMemo(() => {
    const c: Record<AmbulanceStatus, number> = {
      Available: 0,
      "On Duty": 0,
      "Under Maintenance": 0,
      "Out of Service": 0,
    };
    rows.forEach((a) => {
      c[a.status] += 1;
    });
    return c;
  }, [rows]);

  const handleSubmit = async (input: CreateAmbulanceInput) => {
    try {
      if (drawerMode === "edit" && selected) {
        await updateMutation.mutateAsync({ id: selected.id, input });
        enqueueSnackbar(`Updated ${input.vehicleNumber}.`, {
          variant: "success",
        });
      } else {
        await createMutation.mutateAsync(input);
        enqueueSnackbar(`Registered ${input.vehicleNumber}.`, {
          variant: "success",
        });
      }
      setDrawerMode(null);
      setSelected(null);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleDelete = async (a: ApiAmbulance) => {
    if (!window.confirm(`Delete ambulance ${a.vehicleNumber}?`)) return;
    try {
      await deleteMutation.mutateAsync(a.id);
      enqueueSnackbar(`Deleted ${a.vehicleNumber}.`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const columns: GridColDef<ApiAmbulance>[] = [
    {
      field: "vehicleNumber",
      headerName: "Vehicle Number",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "ui-monospace, monospace",
            color: "primary.main",
          }}
        >
          {row.vehicleNumber}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.6,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Tooltip title={AMBULANCE_TYPE_INFO[row.type]?.fullName ?? ""}>
          <span>
            <StatusChip label={row.type} tone="primary" />
          </span>
        </Tooltip>
      ),
    },
    {
      field: "driver",
      headerName: "Driver",
      flex: 1.1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {row.driverName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {row.driverPhone}
          </Typography>
        </Box>
      ),
    },
    {
      field: "equipment",
      headerName: "Equipment",
      flex: 1.4,
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => {
        const visible = row.equipment.slice(0, 2);
        const rest = row.equipment.length - 2;
        return (
          <Tooltip title={row.equipment.join(", ")}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexWrap: "wrap",
              }}
            >
              {visible.map((e) => (
                <Chip
                  key={e}
                  size="small"
                  label={e}
                  sx={{ bgcolor: "#F2EEE6", fontSize: 11, height: 22 }}
                />
              ))}
              {rest > 0 && (
                <Chip
                  size="small"
                  label={`+${rest} more`}
                  sx={{
                    bgcolor: "#E8EEF5",
                    color: "primary.main",
                    fontSize: 11,
                    height: 22,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip label={row.status} tone={STATUS_TONE[row.status]} />
      ),
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      flex: 0.7,
      minWidth: 110,
      renderCell: ({ row }) => formatRelative(row.updatedAt),
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
          onEdit={() => {
            setSelected(row);
            setDrawerMode("edit");
          }}
          onDelete={() => void handleDelete(row)}
        />
      ),
    },
  ];

  const hasFilters = Boolean(q || type || status);
  const resetFilters = () =>
    setParams(new URLSearchParams(), { replace: true });

  return (
    <>
      <PageHeader
        title="Ambulances"
        subtitle="Your hospital's ambulance fleet."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelected(null);
              setDrawerMode("add");
            }}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Register Ambulance
          </Button>
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {STATUS_KEYS.map((s) => (
          <StatusPill key={s} label={s} count={counts[s]} />
        ))}
      </Box>

      <Card
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          value={q}
          onChange={(e) => setParam("q", e.target.value || null)}
          placeholder="Search by vehicle number or driver"
          size="small"
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Type"
          value={type || "all"}
          onChange={(e) =>
            setParam("type", e.target.value === "all" ? null : e.target.value)
          }
          sx={{ width: 200 }}
        >
          <MenuItem value="all">All</MenuItem>
          {TYPE_KEYS.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={status || "all"}
          onChange={(e) =>
            setParam("status", e.target.value === "all" ? null : e.target.value)
          }
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All</MenuItem>
          {STATUS_KEYS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ flex: 1 }} />
        {hasFilters && (
          <Link
            component="button"
            type="button"
            onClick={resetFilters}
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <RefreshIcon fontSize="small" /> Reset
          </Link>
        )}
      </Card>

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
          Failed to load ambulances.
        </Alert>
      )}

      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={56} sx={{ mb: 1 }} />
          ))}
        </Card>
      ) : (
        <Card sx={{ overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={64}
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

      {!isLoading && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "text.secondary" }}
        >
          Showing {rows.length} of {data?.total ?? 0}.
        </Typography>
      )}

      <RegisterAmbulanceDrawer
        open={drawerMode !== null}
        mode={drawerMode ?? "add"}
        initial={selected}
        isPending={createMutation.isPending || updateMutation.isPending}
        onCancel={() => {
          setDrawerMode(null);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
