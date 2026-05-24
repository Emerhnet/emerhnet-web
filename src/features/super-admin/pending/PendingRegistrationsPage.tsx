import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusChip, CATEGORY_TONE } from "@/shared/components/StatusChip";
import { formatIst, formatRelative } from "@/shared/lib/datetime";
import { useHospitals, type ApiHospital } from "../api/hospitals";

const DOCS_TOTAL = 6;

export function PendingRegistrationsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const q = params.get("q") ?? "";
  const fromStr = params.get("from") ?? undefined;
  const toStr = params.get("to") ?? undefined;
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useHospitals({
    status: "pending",
    search: q || undefined,
    from: fromStr,
    to: toStr,
  });

  const rows = data?.items ?? [];
  const hasFilters = Boolean(q || fromStr || toStr);
  const resetFilters = () =>
    setParams(new URLSearchParams(), { replace: true });

  const columns: GridColDef<ApiHospital>[] = [
    {
      field: "hospitalName",
      headerName: "Hospital Name",
      flex: 1.6,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>
            {row.hospitalName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            NIN: {row.nin}
          </Typography>
        </Box>
      ),
    },
    {
      field: "city",
      headerName: "City",
      flex: 0.7,
      minWidth: 110,
      valueGetter: (_val, row) => row.address.city,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip label={row.category} tone={CATEGORY_TONE[row.category]} />
      ),
    },
    {
      field: "createdAt",
      headerName: "Submitted",
      flex: 0.7,
      minWidth: 110,
      renderCell: ({ row }) => (
        <Tooltip title={formatIst(row.createdAt)}>
          <span>{formatRelative(row.createdAt)}</span>
        </Tooltip>
      ),
    },
    {
      field: "docs",
      headerName: "Documents",
      flex: 0.6,
      minWidth: 110,
      sortable: false,
      renderCell: ({ row }) => {
        const uploaded = row.documents.length;
        const complete = uploaded >= DOCS_TOTAL;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {uploaded}/{DOCS_TOTAL}
            </Typography>
            {complete ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: "#0F5132" }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 16, color: "#8B5A00" }} />
            )}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.6,
      minWidth: 110,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/admin/pending/${row.id}`)}
            sx={{ height: 32, fontWeight: 600 }}
          >
            Review
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Pending Registrations"
        subtitle="Applications awaiting your review."
        inlineEnd={
          <StatusChip label={String(data?.total ?? "…")} tone="warning" />
        }
      />

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
          placeholder="Search by hospital name, NIN, or city"
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <DatePicker
          label="From"
          value={from}
          onChange={(d) =>
            setParam("from", d ? d.toISOString().slice(0, 10) : null)
          }
          slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
        />
        <DatePicker
          label="To"
          value={to}
          onChange={(d) =>
            setParam("to", d ? d.toISOString().slice(0, 10) : null)
          }
          slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
        />
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
          Failed to load pending registrations.
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
            rowHeight={56}
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
    </>
  );
}
