import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BuildIcon from "@mui/icons-material/Build";
import CancelIcon from "@mui/icons-material/Cancel";
import { PageHeader } from "@/shared/components/PageHeader";
import { KpiCard } from "@/shared/components/KpiCard";
import { SectionCard } from "@/shared/components/SectionCard";
import { formatRelative } from "@/shared/lib/datetime";
import {
  useHospitalDashboard,
  type AmbulanceStatusCounts,
} from "../api/dashboard";

const AMBULANCE_PILL_COLORS: Record<
  keyof AmbulanceStatusCounts,
  { bg: string; accent: string; fg: string; Icon: typeof CheckCircleIcon }
> = {
  Available: { bg: "#D1E7DD", accent: "#0F5132", fg: "#0F5132", Icon: CheckCircleIcon },
  "On Duty": { bg: "#CFE2FF", accent: "#0B5394", fg: "#0B5394", Icon: DirectionsRunIcon },
  "Under Maintenance": { bg: "#FFF3CD", accent: "#8B5A00", fg: "#8B5A00", Icon: BuildIcon },
  "Out of Service": { bg: "#F8D7DA", accent: "#842029", fg: "#842029", Icon: CancelIcon },
};

function DeptBar({ name, count, max }: { name: string; count: number; max: number }) {
  const pct = max === 0 ? 0 : (count / max) * 100;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.75 }}>
      <Typography sx={{ fontSize: 14, width: { xs: 120, sm: 200 }, flexShrink: 0 }}>
        {name}
      </Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: "#E5E7EB", borderRadius: 999 }}>
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            bgcolor: "primary.main",
            borderRadius: 999,
          }}
        />
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, width: 32, textAlign: "right" }}>
        {count}
      </Typography>
    </Box>
  );
}

function BedRow({ name, total, occupied }: { name: string; total: number; occupied: number }) {
  const available = total - occupied;
  const pct = total === 0 ? 0 : (occupied / total) * 100;
  const tone: "normal" | "warning" | "danger" =
    pct >= 100 ? "danger" : pct >= 85 ? "warning" : "normal";
  const barColor =
    tone === "danger" ? "#842029" : tone === "warning" ? "#8B5A00" : "#0B2545";
  const availColor = available === 0 ? "#842029" : "#0F5132";
  return (
    <Box sx={{ py: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{name}</Typography>
        <Typography sx={{ fontSize: 13 }}>
          <Box component="span" sx={{ color: "text.secondary" }}>Total </Box>
          {total}
          <Box component="span" sx={{ color: "text.secondary" }}> · Occupied </Box>
          {occupied}
          <Box component="span" sx={{ color: "text.secondary" }}> · Available </Box>
          <Box component="span" sx={{ color: availColor, fontWeight: 600 }}>{available}</Box>
        </Typography>
      </Box>
      <Box sx={{ height: 6, bgcolor: "#E5E7EB", borderRadius: 999 }}>
        <Box
          sx={{
            width: `${Math.min(pct, 100)}%`,
            height: "100%",
            bgcolor: barColor,
            borderRadius: 999,
          }}
        />
      </Box>
    </Box>
  );
}

function QuickActionTile({
  Icon,
  label,
  description,
  onClick,
}: {
  Icon: typeof PersonAddIcon;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        cursor: "pointer",
        width: { xs: "100%", sm: 240 },
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        transition: "all 120ms",
        "&:hover": { bgcolor: "#E8EEF5", borderColor: "primary.main" },
      }}
    >
      <Icon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{description}</Typography>
    </Box>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useHospitalDashboard();

  if (isLoading) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="rounded" height={110} />)}
        </div>
        <Skeleton variant="rounded" height={300} />
      </>
    );
  }
  if (isError || !data) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <Alert
          severity="error"
          action={<Button size="small" onClick={() => void refetch()}>Retry</Button>}
        >
          Failed to load dashboard.
        </Alert>
      </>
    );
  }

  const { hospital, kpis, ambulanceStatus, doctorsByDepartment, bedTypes } = data;
  const maxDept = Math.max(...doctorsByDepartment.map((d) => d.count), 1);
  const PILL_KEYS: (keyof AmbulanceStatusCounts)[] = [
    "Available",
    "On Duty",
    "Under Maintenance",
    "Out of Service",
  ];

  return (
    <>
      <PageHeader
        title={hospital.name || "Dashboard"}
        subtitle={`NIN ${hospital.nin} · Last profile update: ${formatRelative(hospital.updatedAt)}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Active Doctors"
          value={kpis.activeDoctors}
          icon={<MedicalServicesIcon />}
          change={`Across ${kpis.departmentCount} departments`}
          changeTone="muted"
        />
        <Card sx={{ p: 2.5, position: "relative" }}>
          <Box sx={{ position: "absolute", top: 16, right: 16, color: "primary.main" }}>
            <HotelIcon />
          </Box>
          <Typography sx={{ fontSize: 32, fontWeight: 600, lineHeight: 1.1 }}>
            {kpis.totalBeds}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            Total Beds
          </Typography>
          <Typography sx={{ fontSize: 12, mt: 1 }}>
            {kpis.occupiedBeds} occupied ·{" "}
            <Box component="span" sx={{ color: "#0F5132", fontWeight: 600 }}>
              {kpis.availableBeds} available
            </Box>
          </Typography>
        </Card>
        <KpiCard
          label="Available Ambulances"
          value={`${kpis.availableAmbulances} / ${kpis.totalAmbulances}`}
          icon={<LocalShippingIcon />}
          change={`${kpis.onDutyAmbulances} on duty`}
          changeTone="muted"
        />
        <KpiCard
          label="Departments"
          value={kpis.departmentCount}
          icon={<ApartmentIcon />}
          change="Active"
          changeTone="muted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SectionCard
          title="Doctors by Department"
          action={
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/hospital/doctors")}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Manage doctors →
            </Link>
          }
        >
          {doctorsByDepartment.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              No doctors yet.
            </Typography>
          ) : (
            doctorsByDepartment.map((d) => (
              <DeptBar key={d.name} name={d.name} count={d.count} max={maxDept} />
            ))
          )}
          <Box sx={{ pt: 1.5, textAlign: "center" }}>
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/hospital/departments")}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Show all {kpis.departmentCount} →
            </Link>
          </Box>
        </SectionCard>

        <SectionCard
          title="Bed Occupancy"
          action={
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/hospital/beds")}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Update counts →
            </Link>
          }
        >
          {bedTypes.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              No bed types configured.
            </Typography>
          ) : (
            bedTypes.map((b) => (
              <BedRow key={b.type} name={b.type} total={b.total} occupied={b.occupied} />
            ))
          )}
        </SectionCard>
      </div>

      <Box sx={{ mb: 3 }}>
        <SectionCard title="Ambulance Fleet Status">
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {PILL_KEYS.map((s) => {
              const t = AMBULANCE_PILL_COLORS[s];
              const count = ambulanceStatus[s];
              const dim = count === 0;
              const Icon = t.Icon;
              return (
                <Card
                  key={s}
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
                      bgcolor: t.accent,
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
                      {s}
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
            })}
          </Box>
        </SectionCard>
      </Box>

      <SectionCard title="Quick actions">
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <QuickActionTile
            Icon={PersonAddIcon}
            label="Add a doctor"
            description="Register a new practitioner."
            onClick={() => navigate("/hospital/doctors")}
          />
          <QuickActionTile
            Icon={EditNoteIcon}
            label="Update bed counts"
            description="Set total and occupied per bed type."
            onClick={() => navigate("/hospital/beds")}
          />
          <QuickActionTile
            Icon={AddCircleIcon}
            label="Register ambulance"
            description="Add a new vehicle to the fleet."
            onClick={() => navigate("/hospital/ambulances")}
          />
        </Box>
      </SectionCard>
    </>
  );
}
