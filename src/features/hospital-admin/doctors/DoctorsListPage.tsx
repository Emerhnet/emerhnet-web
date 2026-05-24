import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusChip, DOCTOR_STATUS_TONE } from "@/shared/components/StatusChip";
import { formatIst } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { useDepartments } from "../api/departments";
import {
  useDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeactivateDoctor,
  useReactivateDoctor,
  type ApiDoctor,
  type CreateDoctorInput,
} from "../api/doctors";
import { DoctorDrawer } from "./components/DoctorDrawer";

function RowMenu({
  isActive,
  onEdit,
  onToggle,
}: {
  isActive: boolean;
  onEdit: () => void;
  onToggle: () => void;
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
            onToggle();
          }}
          sx={{ color: isActive ? "error.main" : "success.main" }}
        >
          {isActive ? "Deactivate" : "Reactivate"}
        </MenuItem>
      </Menu>
    </>
  );
}

export function DoctorsListPage() {
  const [params, setParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<ApiDoctor | null>(null);

  const q = params.get("q") ?? "";
  const deptId = params.get("dept") ?? "";
  const statusParam = params.get("status") ?? "";
  const status: "active" | "deactivated" | undefined =
    statusParam === "active" || statusParam === "deactivated"
      ? statusParam
      : undefined;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data: departments } = useDepartments();
  const deptMap = useMemo(
    () => new Map((departments ?? []).map((d) => [d.id, d.name])),
    [departments],
  );

  const { data, isLoading, isError, refetch } = useDoctors({
    search: q || undefined,
    departmentId: deptId || undefined,
    status,
    pageSize: 100,
  });

  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deactivateMutation = useDeactivateDoctor();
  const reactivateMutation = useReactivateDoctor();

  const rows = data?.items ?? [];
  const hasFilters = Boolean(q || deptId || status);
  const resetFilters = () =>
    setParams(new URLSearchParams(), { replace: true });

  const handleSubmit = async (input: CreateDoctorInput) => {
    try {
      if (drawerMode === "edit" && selectedDoctor) {
        await updateMutation.mutateAsync({ id: selectedDoctor.id, input });
        enqueueSnackbar(`Updated ${input.fullName}.`, { variant: "success" });
      } else {
        await createMutation.mutateAsync(input);
        enqueueSnackbar(`Added ${input.fullName}.`, { variant: "success" });
      }
      setDrawerMode(null);
      setSelectedDoctor(null);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleToggle = async (doctor: ApiDoctor) => {
    try {
      if (doctor.deactivatedAt) {
        await reactivateMutation.mutateAsync(doctor.id);
        enqueueSnackbar(`Reactivated ${doctor.fullName}.`, {
          variant: "success",
        });
      } else {
        await deactivateMutation.mutateAsync(doctor.id);
        enqueueSnackbar(`Deactivated ${doctor.fullName}.`, {
          variant: "success",
        });
      }
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const columns: GridColDef<ApiDoctor>[] = [
    {
      field: "fullName",
      headerName: "Doctor",
      flex: 1.4,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: 12,
            }}
          >
            {row.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {row.fullName}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {row.councilReg}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "departmentId",
      headerName: "Department",
      flex: 1,
      minWidth: 160,
      valueGetter: (_v, row) => deptMap.get(row.departmentId) ?? "—",
    },
    {
      field: "specialisation",
      headerName: "Specialisation",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "qualifications",
      headerName: "Qualifications",
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => {
        const qs = row.qualifications;
        const visible = qs.slice(0, 2).join(", ");
        const rest = qs.length > 2 ? ` +${qs.length - 2} more` : "";
        return (
          <Tooltip title={qs.join(", ")}>
            <Typography sx={{ fontSize: 13 }}>
              {visible}
              {rest && (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {rest}
                </Box>
              )}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "joinedAt",
      headerName: "Joined",
      flex: 0.7,
      minWidth: 110,
      renderCell: ({ row }) => formatIst(row.joinedAt, "dd MMM yyyy"),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 120,
      valueGetter: (_v, row) => (row.deactivatedAt ? "Deactivated" : "Active"),
      renderCell: ({ row }) => {
        const label = row.deactivatedAt ? "Deactivated" : "Active";
        return <StatusChip label={label} tone={DOCTOR_STATUS_TONE[label]} />;
      },
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
          isActive={!row.deactivatedAt}
          onEdit={() => {
            setSelectedDoctor(row);
            setDrawerMode("edit");
          }}
          onToggle={() => void handleToggle(row)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Doctors"
        subtitle="Manage your hospital's medical staff."
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => {
              setSelectedDoctor(null);
              setDrawerMode("add");
            }}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Add Doctor
          </Button>
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
          placeholder="Search by name, reg, or email"
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
          label="Department"
          value={deptId || "all"}
          onChange={(e) =>
            setParam("dept", e.target.value === "all" ? null : e.target.value)
          }
          sx={{ width: 220 }}
        >
          <MenuItem value="all">All</MenuItem>
          {(departments ?? []).map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={status ?? "all"}
          onChange={(e) =>
            setParam("status", e.target.value === "all" ? null : e.target.value)
          }
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="deactivated">Deactivated</MenuItem>
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
          Failed to load doctors.
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

      <DoctorDrawer
        open={drawerMode !== null}
        mode={drawerMode ?? "add"}
        doctor={selectedDoctor}
        isPending={createMutation.isPending || updateMutation.isPending}
        onCancel={() => {
          setDrawerMode(null);
          setSelectedDoctor(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
