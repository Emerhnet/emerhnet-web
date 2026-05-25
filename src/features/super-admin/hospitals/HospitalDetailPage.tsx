import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BuildIcon from "@mui/icons-material/Build";
import CancelIcon from "@mui/icons-material/Cancel";
import { iconForDepartment } from "@/features/hospital-admin/departments/icons";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { SectionCard } from "@/shared/components/SectionCard";
import {
  StatusChip,
  CATEGORY_TONE,
  HOSPITAL_STATUS_TONE,
} from "@/shared/components/StatusChip";
import { formatIst } from "@/shared/lib/datetime";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import {
  useHospital,
  useSuspendHospital,
  useReactivateHospital,
  useHospitalDoctors,
  useHospitalDepartments,
  useHospitalBeds,
  useHospitalAmbulances,
  useHospitalDocumentUrl,
  type ApiHospital,
  type ApiHospitalStatus,
} from "../api/hospitals";
import { SuspendDialog } from "./components/SuspendDialog";

const TAB_LABELS = [
  "Overview",
  "Doctors",
  "Departments",
  "Beds",
  "Ambulances",
  "Documents",
  "Audit Log",
];

const STATUS_LABELS: Record<
  ApiHospitalStatus,
  keyof typeof HOSPITAL_STATUS_TONE
> = {
  approved: "Approved",
  pending: "Pending",
  suspended: "Suspended",
  rejected: "Rejected",
};

function ReadRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
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
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {value || "—"}
      </Typography>
    </div>
  );
}

function OverviewTab({ hospital }: { hospital: ApiHospital }) {
  const { address, contact, adminContact } = hospital;
  const initials = adminContact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Box
        sx={{
          gridColumn: { xs: "auto", lg: "span 3" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <SectionCard
          title="Hospital Profile"
          action={
            <Link
              component="button"
              type="button"
              underline="hover"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <EditIcon fontSize="small" />
              Edit Details
            </Link>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadRow label="Hospital Name" value={hospital.hospitalName} />
            <ReadRow label="NIN" value={hospital.nin} />
            <ReadRow
              label="CEA Licence"
              value={hospital.ceaLicenceNumber || "—"}
            />
            <ReadRow label="Category" value={hospital.category} />
            <ReadRow
              label="CGHS"
              value={hospital.cghsEmpanelment ? "Yes" : "No"}
            />
            <ReadRow
              label="Ayushman Bharat"
              value={hospital.ayushmanEmpanelment ? "Yes" : "No"}
            />
            <ReadRow label="Hospital Email" value={contact.email} />
            <ReadRow label="Hospital Phone" value={contact.phone} />
            <ReadRow
              label="Address"
              value={`${address.line1}${address.line2 ? ", " + address.line2 : ""}`}
            />
            <ReadRow label="Pincode" value={address.pincode} />
            <ReadRow label="State" value={address.state} />
            <ReadRow label="City" value={address.city} />
            <ReadRow label="Submitted" value={formatIst(hospital.createdAt)} />
            <ReadRow label="Tracking ID" value={hospital.trackingId} />
          </div>
        </SectionCard>

        <SectionCard title="Hospital Admin">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: 18,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {adminContact.name}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Hospital Admin
              </Typography>
              <Box sx={{ display: "flex", gap: 3, mt: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 13 }}>
                  {adminContact.email}
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  {adminContact.phone}
                </Typography>
              </Box>
            </Box>
          </Box>
        </SectionCard>
      </Box>

      <Box
        sx={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Card sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              position: "relative",
              height: 200,
              bgcolor: "#EEF2F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Number.isFinite(address.latitude) &&
            Number.isFinite(address.longitude) ? (
              <iframe
                key={`${address.latitude},${address.longitude}`}
                title="Hospital location"
                src={(() => {
                  const la = Number(address.latitude);
                  const lo = Number(address.longitude);
                  const d = 0.01;
                  return `https://www.openstreetmap.org/export/embed.html?bbox=${lo - d}%2C${la - d}%2C${lo + d}%2C${la + d}&layer=mapnik&marker=${la}%2C${lo}`;
                })()}
                style={{ border: 0, width: "100%", height: "100%" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No coordinates on file
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
                Current coordinates
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontFamily: "ui-monospace, monospace",
                  mt: 0.25,
                }}
              >
                {address.latitude}Â° N, {address.longitude}Â° E
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${address.latitude},${address.longitude}`,
                  "_blank",
                  "noopener",
                )
              }
              sx={{ fontWeight: 600 }}
            >
              Open Maps
            </Button>
          </Box>
        </Card>

        {hospital.reviewNotes && (
          <SectionCard title="Review Notes">
            <Typography variant="body2">{hospital.reviewNotes}</Typography>
          </SectionCard>
        )}
      </Box>
    </div>
  );
}

function DoctorsTabImpl({ hospitalId }: { hospitalId: string }) {
  const { data, isLoading, isError, refetch } = useHospitalDoctors(hospitalId);
  const { data: deptList } = useHospitalDepartments(hospitalId);
  const deptMap = new Map(
    (deptList ?? []).map((d) => [d.id as string, d.name as string]),
  );

  const columns: GridColDef<Record<string, unknown>>[] = [
    {
      field: "fullName",
      headerName: "Doctor",
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ row }) => {
        const name = String(row.fullName ?? "");
        const reg = String(row.councilReg ?? "");
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={(row.photoUrl as string | null) ?? undefined}
              sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 12 }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{name}</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: "ui-monospace, monospace" }}>
                {reg}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "departmentId",
      headerName: "Department",
      flex: 1,
      minWidth: 160,
      valueGetter: (_v, row) => deptMap.get(String(row.departmentId)) ?? "—",
    },
    {
      field: "specialisation",
      headerName: "Specialisation",
      flex: 1.2,
      minWidth: 200,
    },
    {
      field: "joinedAt",
      headerName: "Joined",
      flex: 0.7,
      minWidth: 110,
      renderCell: ({ row }) =>
        row.joinedAt
          ? formatIst(String(row.joinedAt), "dd MMM yyyy")
          : "—",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 130,
      renderCell: ({ row }) => {
        if (row.deactivatedAt) return <StatusChip label="Deactivated" tone="muted" />;
        const d = String(row.dutyStatus ?? "active");
        const label =
          d === "active" ? "Active" : d === "on_leave" ? "On Leave" : "Off Duty";
        const tone: "success" | "warning" | "danger" =
          d === "active" ? "success" : d === "on_leave" ? "warning" : "danger";
        return <StatusChip label={label} tone={tone} />;
      },
    },
  ];

  if (isError) {
    return (
      <Alert
        severity="error"
        action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
      >
        Failed to load doctors.
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          Registered Practitioners
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Read-only. The Hospital Admin manages this list.
        </Typography>
      </Box>
      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={56} sx={{ mb: 1 }} />
          ))}
        </Card>
      ) : (
        <Card sx={{ overflow: "hidden" }}>
          <DataGrid
            rows={data?.items ?? []}
            columns={columns}
            rowHeight={64}
            getRowId={(r) => String(r.id)}
            initialState={{ pagination: { paginationModel: { pageSize: 20, page: 0 } } }}
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
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
            }}
          />
        </Card>
      )}
    </>
  );
}

function DepartmentsTab({ hospitalId }: { hospitalId: string }) {
  const { data, isLoading, isError, refetch } = useHospitalDepartments(hospitalId);
  if (isError)
    return (
      <Alert
        severity="error"
        action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
      >
        Failed to load departments.
      </Alert>
    );
  if (isLoading) return <Skeleton variant="rounded" height={200} />;
  const rows = data ?? [];
  if (rows.length === 0)
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No departments configured.
        </Typography>
      </Card>
    );
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 320px))",
        gap: 2,
        justifyContent: "start",
      }}
    >
      {rows.map((d) => {
        const Icon = iconForDepartment(String(d.name));
        return (
          <Card key={String(d.id)} sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                  {String(d.name)}
                </Typography>
                <Box>
                  <StatusChip
                    label={d.active ? "Active" : "Inactive"}
                    tone={d.active ? "info" : "danger"}
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
                {(d.headDoctorName as string | null) ?? "Not assigned"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mt: "auto",
                pt: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <MedicalServicesIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {String(d.doctorCount ?? 0)} doctors
              </Typography>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}

function BedsTab({ hospitalId }: { hospitalId: string }) {
  const { data, isLoading, isError, refetch } = useHospitalBeds(hospitalId);
  if (isError)
    return (
      <Alert
        severity="error"
        action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
      >
        Failed to load beds.
      </Alert>
    );
  if (isLoading) return <Skeleton variant="rounded" height={200} />;
  const rows = data?.items ?? [];
  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
            Total
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{data?.totals.total ?? 0}</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
            Occupied
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{data?.totals.occupied ?? 0}</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, minWidth: 180 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
            Available
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: "success.main" }}>
            {(data?.totals.total ?? 0) - (data?.totals.occupied ?? 0)}
          </Typography>
        </Card>
      </Box>
      {rows.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No bed types configured.
          </Typography>
        </Card>
      ) : (
        <Card sx={{ overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={[
              { field: "type", headerName: "Type", flex: 1.5, minWidth: 200 },
              { field: "total", headerName: "Total", flex: 0.5, minWidth: 80, type: "number" },
              { field: "occupied", headerName: "Occupied", flex: 0.5, minWidth: 90, type: "number" },
              {
                field: "available",
                headerName: "Available",
                flex: 0.5,
                minWidth: 90,
                valueGetter: (_v, row) =>
                  (row.total as number) - (row.occupied as number),
              },
            ] as GridColDef<Record<string, unknown>>[]}
            rowHeight={56}
            getRowId={(r) => String(r.id)}
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
              "& .MuiDataGrid-row:hover": { bgcolor: "#FAFAFA" },
            }}
          />
        </Card>
      )}
    </>
  );
}

type AmbStatus = "Available" | "On Duty" | "Under Maintenance" | "Out of Service";

const AMB_PILL_TONE: Record<
  AmbStatus,
  { bg: string; fg: string; rail: string; Icon: typeof CheckCircleIcon }
> = {
  Available: { bg: "#D1E7DD", fg: "#0F5132", rail: "#0F5132", Icon: CheckCircleIcon },
  "On Duty": { bg: "#CFE2FF", fg: "#0B5394", rail: "#0B5394", Icon: DirectionsRunIcon },
  "Under Maintenance": { bg: "#FFF3CD", fg: "#8B5A00", rail: "#8B5A00", Icon: BuildIcon },
  "Out of Service": { bg: "#F8D7DA", fg: "#842029", rail: "#842029", Icon: CancelIcon },
};

const AMB_STATUS_TONE: Record<AmbStatus, "success" | "info" | "warning" | "danger"> = {
  Available: "success",
  "On Duty": "info",
  "Under Maintenance": "warning",
  "Out of Service": "danger",
};

function AmbStatusPill({ label, count }: { label: AmbStatus; count: number }) {
  const t = AMB_PILL_TONE[label];
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

function AmbulancesTab({ hospitalId }: { hospitalId: string }) {
  const { data, isLoading, isError, refetch } = useHospitalAmbulances(hospitalId);
  if (isError)
    return (
      <Alert
        severity="error"
        action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
      >
        Failed to load ambulances.
      </Alert>
    );
  if (isLoading) return <Skeleton variant="rounded" height={200} />;
  const rows = data?.items ?? [];
  const counts: Record<AmbStatus, number> = {
    Available: 0,
    "On Duty": 0,
    "Under Maintenance": 0,
    "Out of Service": 0,
  };
  rows.forEach((a) => {
    const s = String(a.status) as AmbStatus;
    if (counts[s] !== undefined) counts[s] += 1;
  });
  const STATUS_KEYS: AmbStatus[] = [
    "Available",
    "On Duty",
    "Under Maintenance",
    "Out of Service",
  ];

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {STATUS_KEYS.map((s) => (
          <AmbStatusPill key={s} label={s} count={counts[s]} />
        ))}
      </Box>
      <Card sx={{ overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={[
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
                  {String(row.vehicleNumber)}
                </Typography>
              ),
            },
            {
              field: "type",
              headerName: "Type",
              flex: 0.6,
              minWidth: 100,
              renderCell: ({ row }) => (
                <StatusChip label={String(row.type)} tone="primary" />
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
                    {String(row.driverName)}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {String(row.driverPhone)}
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
                const eq = (row.equipment as string[]) ?? [];
                const visible = eq.slice(0, 2);
                const rest = eq.length - 2;
                return (
                  <Tooltip title={eq.join(", ")}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
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
              renderCell: ({ row }) => {
                const s = String(row.status) as AmbStatus;
                return <StatusChip label={s} tone={AMB_STATUS_TONE[s] ?? "muted"} />;
              },
            },
          ] as GridColDef<Record<string, unknown>>[]}
          rowHeight={64}
          getRowId={(r) => String(r.id)}
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
          }}
        />
      </Card>
    </>
  );
}

function DocumentsTab({ hospital }: { hospital: ApiHospital }) {
  if (!hospital.documents || hospital.documents.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No documents uploaded.
        </Typography>
      </Card>
    );
  }
  return (
    <Card sx={{ overflow: "hidden" }}>
      {hospital.documents.map((d, i) => (
        <DocRow
          key={d.slotKey}
          hospitalId={hospital.id}
          doc={d}
          divider={i < hospital.documents.length - 1}
        />
      ))}
    </Card>
  );
}

function DocRow({
  hospitalId,
  doc,
  divider,
}: {
  hospitalId: string;
  doc: ApiHospital["documents"][number];
  divider: boolean;
}) {
  const [enabled, setEnabled] = useState(false);
  const { data: url, isFetching } = useHospitalDocumentUrl(
    hospitalId,
    doc.slotKey,
    enabled,
  );
  React.useEffect(() => {
    if (url) window.open(url, "_blank", "noopener");
  }, [url]);

  const sizeKb = (doc.sizeBytes / 1024).toFixed(0);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2.5,
        py: 1.75,
        borderBottom: divider ? "1px solid" : "none",
        borderColor: "divider",
      }}
    >
      <DescriptionIcon sx={{ color: "primary.main" }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{doc.slotKey}</Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {doc.fileName} · {sizeKb} KB
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setEnabled(true)}
        disabled={isFetching}
      >
        {isFetching ? "Loading…" : "View"}
      </Button>
    </Box>
  );
}


function PlaceholderTab({ label }: { label: string }) {
  return (
    <Card sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Coming soon.
      </Typography>
    </Card>
  );
}

export function HospitalDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: hospital, isLoading, isError } = useHospital(id);
  const suspendMutation = useSuspendHospital();
  const reactivateMutation = useReactivateHospital();

  const [tab, setTab] = useState(0);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const handleSuspend = async (reason: string) => {
    try {
      await suspendMutation.mutateAsync({ id, notes: reason });
      setSuspendOpen(false);
      enqueueSnackbar(`${hospital?.hospitalName ?? "Hospital"} suspended.`, {
        variant: "success",
      });
      navigate("/admin/hospitals");
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync(id);
      enqueueSnackbar(`${hospital?.hospitalName ?? "Hospital"} reactivated.`, {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: "error" });
    }
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Hospitals", to: "/admin/hospitals" },
            { label: "…" },
          ]}
        />
        <Skeleton height={40} sx={{ mt: 2, maxWidth: 400 }} />
        <Skeleton height={300} sx={{ mt: 2 }} />
      </>
    );
  }

  if (isError || !hospital) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Hospitals", to: "/admin/hospitals" },
            { label: "Error" },
          ]}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load hospital details.
        </Alert>
      </>
    );
  }

  const statusLabel = STATUS_LABELS[hospital.status];
  const isSuspended = hospital.status === "suspended";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/admin/dashboard" },
          { label: "Hospitals", to: "/admin/hospitals" },
          { label: hospital.hospitalName },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: 28, fontWeight: 600, mb: 1 }}
          >
            {hospital.hospitalName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              NIN: {hospital.nin}
            </Typography>
            <StatusChip
              label={hospital.category}
              tone={CATEGORY_TONE[hospital.category]}
            />
            <StatusChip
              label={statusLabel}
              tone={HOSPITAL_STATUS_TONE[statusLabel]}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {isSuspended ? (
            <Button
              variant="outlined"
              startIcon={<PlayCircleIcon />}
              onClick={() => void handleReactivate()}
              disabled={reactivateMutation.isPending}
              sx={{ height: 40, fontWeight: 600 }}
            >
              {reactivateMutation.isPending ? "Reactivating…" : "Reactivate"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => setSuspendOpen(true)}
              disabled={hospital.status !== "approved"}
              sx={{ height: 40, fontWeight: 600 }}
            >
              Suspend
            </Button>
          )}
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
      >
        {TAB_LABELS.map((l) => (
          <Tab
            key={l}
            label={l}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        ))}
      </Tabs>

      {tab === 0 && <OverviewTab hospital={hospital} />}
      {tab === 1 && <DoctorsTabImpl hospitalId={hospital.id} />}
      {tab === 2 && <DepartmentsTab hospitalId={hospital.id} />}
      {tab === 3 && <BedsTab hospitalId={hospital.id} />}
      {tab === 4 && <AmbulancesTab hospitalId={hospital.id} />}
      {tab === 5 && <DocumentsTab hospital={hospital} />}
      {tab === 6 && <PlaceholderTab label="Audit Log" />}

      <SuspendDialog
        open={suspendOpen}
        hospitalName={hospital.hospitalName}
        isPending={suspendMutation.isPending}
        onCancel={() => setSuspendOpen(false)}
        onConfirm={(reason) => void handleSuspend(reason)}
      />

      {hospital.status === "approved" && (
        <Box sx={{ display: "none" }}>
          <CheckCircleIcon />
        </Box>
      )}
    </>
  );
}
