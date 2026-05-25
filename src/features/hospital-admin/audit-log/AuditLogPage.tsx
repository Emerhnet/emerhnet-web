import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DomainIcon from "@mui/icons-material/Domain";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusChip, type StatusTone } from "@/shared/components/StatusChip";
import { formatIst } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { AuditDetailDrawer } from "@/features/super-admin/audit-log/components/AuditDetailDrawer";
import {
  useAuditLog,
  downloadCsv,
  type ApiAuditEntry,
} from "@/features/super-admin/api/auditLog";

const TARGET_ICONS: Record<string, typeof DomainIcon> = {
  Doctor: MedicalServicesIcon,
  Department: AssignmentIcon,
  Bed: HotelIcon,
  BedConfig: HotelIcon,
  Ambulance: LocalShippingIcon,
  Hospital: DomainIcon,
  User: VpnKeyIcon,
  Session: VpnKeyIcon,
};

function actionTone(action: string): StatusTone {
  if (
    action.endsWith(".approved") ||
    action.endsWith(".created") ||
    action.endsWith(".reactivated")
  )
    return "success";
  if (
    action.endsWith(".rejected") ||
    action.endsWith(".deleted") ||
    action.endsWith(".suspended") ||
    action.endsWith(".deactivated") ||
    action.endsWith(".cancelled")
  )
    return "danger";
  if (action.endsWith(".failed") || action.endsWith(".expired"))
    return "warning";
  if (action.startsWith("auth.")) return "info";
  if (action.startsWith("export.")) return "primary";
  return "muted";
}

export function AuditLogPage() {
  const [params, setParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [selected, setSelected] = useState<ApiAuditEntry | null>(null);
  const [exporting, setExporting] = useState(false);

  const q = params.get("q") ?? "";
  const fromStr = params.get("from") ?? "";
  const toStr = params.get("to") ?? "";
  const actions = (params.get("actions")?.split(",").filter(Boolean) ??
    []) as string[];

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useAuditLog({
    search: q || undefined,
    actions: actions.length ? actions : undefined,
    from: fromStr || undefined,
    to: toStr || undefined,
    pageSize: 200,
  });

  const rows = data?.items ?? [];
  const knownActions = Array.from(new Set(rows.map((r) => r.action))).sort();

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadCsv(
        "/exports/audit-log.csv",
        `audit-log-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      enqueueSnackbar("Export downloaded.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Export failed."), {
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const columns: GridColDef<ApiAuditEntry>[] = [
    {
      field: "createdAt",
      headerName: "Timestamp",
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Typography
          sx={{ fontSize: 13, fontFamily: "ui-monospace, monospace" }}
        >
          {formatIst(row.createdAt)}
        </Typography>
      ),
    },
    {
      field: "actor",
      headerName: "Actor",
      flex: 1.2,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor:
                row.actorRole === "anonymous" ? "#8C8C8C" : "primary.main",
              fontSize: 11,
            }}
          >
            {row.actorName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "SY"}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              {row.actorName}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {row.actorRole}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1.1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <StatusChip label={row.action} tone={actionTone(row.action)} />
      ),
    },
    {
      field: "target",
      headerName: "Target",
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ row }) => {
        const Icon =
          (row.entityType ? TARGET_ICONS[row.entityType] : undefined) ??
          AssignmentIcon;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Icon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography sx={{ fontSize: 13 }}>
              <Typography
                component="span"
                sx={{ fontSize: 13, color: "text.secondary" }}
              >
                {row.entityType ?? "—"}
              </Typography>{" "}
              {row.entityId ?? ""}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Audit Log"
        subtitle="Activity within your hospital. Append-only and read-only."
        action={
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => void handleExport()}
            disabled={exporting}
            sx={{ height: 40, fontWeight: 600 }}
          >
            {exporting ? "Exporting…" : "Export to CSV"}
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            value={q}
            onChange={(e) => setParam("q", e.target.value || null)}
            placeholder="Search action or entity"
            size="small"
            sx={{ width: { xs: "100%", sm: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Autocomplete
            multiple
            size="small"
            freeSolo
            options={knownActions}
            value={actions}
            onChange={(_, value) =>
              setParam("actions", value.length ? value.join(",") : null)
            }
            renderTags={(value, getTagProps) =>
              value.map((v, idx) => {
                const { key: _k, ...tagProps } = getTagProps({ index: idx });
                return <Chip key={v} size="small" label={v} {...tagProps} />;
              })
            }
            renderInput={(p) => <TextField {...p} label="Action type" />}
            sx={{ width: { xs: "100%", sm: 340 } }}
          />
          <DatePicker
            label="From"
            value={fromStr ? new Date(fromStr) : null}
            onChange={(d) =>
              setParam("from", d ? d.toISOString().slice(0, 10) : null)
            }
            slotProps={{ textField: { size: "small", sx: { width: { xs: "calc(50% - 8px)", sm: 160 } } } }}
          />
          <DatePicker
            label="To"
            value={toStr ? new Date(toStr) : null}
            onChange={(d) =>
              setParam("to", d ? d.toISOString().slice(0, 10) : null)
            }
            slotProps={{ textField: { size: "small", sx: { width: { xs: "calc(50% - 8px)", sm: 160 } } } }}
          />
        </Box>
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
          Failed to load audit log.
        </Alert>
      )}

      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(8)].map((_, i) => (
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
              pagination: { paginationModel: { pageSize: 50, page: 0 } },
            }}
            pageSizeOptions={[20, 50, 100, 200]}
            disableRowSelectionOnClick
            autoHeight
            onRowClick={(p) => setSelected(p.row as ApiAuditEntry)}
            sx={{
              border: "none",
              cursor: "pointer",
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
          Showing {rows.length} of {data?.total?.toLocaleString() ?? 0}.
        </Typography>
      )}

      <AuditDetailDrawer entry={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default AuditLogPage;
