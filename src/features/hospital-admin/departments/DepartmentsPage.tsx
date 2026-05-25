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
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { iconForDepartment } from "./icons";
import { useSnackbar } from "notistack";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusChip } from "@/shared/components/StatusChip";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  type ApiDepartment,
} from "../api/departments";
import { AddDepartmentDialog } from "./components/AddDepartmentDialog";

function DeptCard({
  dept,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  dept: ApiDepartment;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const canDeleteOrDeactivate = dept.doctorCount === 0;
  const Icon = iconForDepartment(dept.name);

  return (
    <Card sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "#E8EEF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 22, color: "primary.main" }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>
            {dept.name}
          </Typography>
          <Box>
            <StatusChip
              label={dept.active ? "Active" : "Inactive"}
              tone={dept.active ? "info" : "danger"}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 500,
            display: "block",
          }}
        >
          Head of Department
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mt: 0.25 }}>
          {dept.headDoctorName ?? "Not assigned"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: "auto",
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <MedicalServicesIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {dept.doctorCount} doctors
          </Typography>
        </Box>
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
            Rename
          </MenuItem>
          {dept.active ? (
            <Tooltip
              title={
                canDeleteOrDeactivate
                  ? ""
                  : "Reassign or deactivate all doctors first."
              }
              placement="left"
            >
              <Box>
                <MenuItem
                  disabled={!canDeleteOrDeactivate}
                  onClick={() => {
                    setAnchor(null);
                    onToggleActive();
                  }}
                  sx={{ color: "error.main" }}
                >
                  Deactivate
                </MenuItem>
              </Box>
            </Tooltip>
          ) : (
            <MenuItem
              onClick={() => {
                setAnchor(null);
                onToggleActive();
              }}
            >
              Reactivate
            </MenuItem>
          )}
          <Tooltip
            title={
              canDeleteOrDeactivate
                ? ""
                : "Reassign or deactivate all doctors first."
            }
            placement="left"
          >
            <Box>
              <MenuItem
                disabled={!canDeleteOrDeactivate}
                onClick={() => {
                  setAnchor(null);
                  onDelete();
                }}
                sx={{ color: "error.main" }}
              >
                Delete
              </MenuItem>
            </Box>
          </Tooltip>
        </Menu>
      </Box>
    </Card>
  );
}

export function DepartmentsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ApiDepartment | null>(null);

  const { data: departments, isLoading, isError, refetch } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const handleCreate = async ({ name }: { name: string }) => {
    try {
      await createMutation.mutateAsync({ name });
      enqueueSnackbar(`Department "${name}" added.`, { variant: "success" });
      setAddOpen(false);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleRename = async ({ name }: { name: string }) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, input: { name } });
      enqueueSnackbar(`Department renamed.`, { variant: "success" });
      setEditing(null);
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleToggle = async (dept: ApiDepartment) => {
    try {
      await updateMutation.mutateAsync({
        id: dept.id,
        input: { active: !dept.active },
      });
      enqueueSnackbar(
        `Department ${dept.active ? "deactivated" : "reactivated"}.`,
        { variant: "success" },
      );
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleDelete = async (dept: ApiDepartment) => {
    if (!window.confirm(`Delete "${dept.name}"? This cannot be undone.`))
      return;
    try {
      await deleteMutation.mutateAsync(dept.id);
      enqueueSnackbar(`Department deleted.`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Administrative groupings for your doctors."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Add Department
          </Button>
        }
      />

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
          Failed to load departments.
        </Alert>
      )}

      {isLoading ? (
        <div
          className="gap-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 320px))",
            justifyContent: "start",
            maxWidth: "100%",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={140} />
          ))}
        </div>
      ) : (
        <div
          className="gap-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 320px))",
            justifyContent: "start",
            maxWidth: "100%",
          }}
        >
          {(departments ?? []).map((d) => (
            <DeptCard
              key={d.id}
              dept={d}
              onEdit={() => setEditing(d)}
              onToggleActive={() => void handleToggle(d)}
              onDelete={() => void handleDelete(d)}
            />
          ))}
          {departments && departments.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", gridColumn: "1 / -1" }}
            >
              No departments yet. Add one to start grouping doctors.
            </Typography>
          )}
        </div>
      )}

      <AddDepartmentDialog
        open={addOpen}
        isPending={createMutation.isPending}
        onCancel={() => setAddOpen(false)}
        onConfirm={handleCreate}
      />
      <AddDepartmentDialog
        open={Boolean(editing)}
        isPending={updateMutation.isPending}
        initialName={editing?.name ?? ""}
        title="Rename department"
        submitLabel="Save"
        onCancel={() => setEditing(null)}
        onConfirm={handleRename}
      />
    </>
  );
}
