import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { StatusChip, type StatusTone } from "@/shared/components/StatusChip";
import { formatIst } from "@/shared/lib/datetime";
import { type ApiDoctor, type DutyStatus, DAYS } from "../../api/doctors";

const DUTY_LABEL: Record<DutyStatus, string> = {
  active: "Active",
  on_leave: "On Leave",
  off_duty: "Off Duty",
};
const DUTY_TONE: Record<DutyStatus, StatusTone> = {
  active: "success",
  on_leave: "warning",
  off_duty: "danger",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 2, py: 0.75 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  );
}

export function DoctorDetailDrawer({
  doctor,
  departmentName,
  onClose,
  onEdit,
}: {
  doctor: ApiDoctor | null;
  departmentName?: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const open = Boolean(doctor);
  if (!doctor) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 560 } } }} />
    );
  }
  const initials = doctor.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const status: DutyStatus = doctor.dutyStatus;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 560 },
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Doctor profile</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
            Edit
          </Button>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
        <Card sx={{ p: 2.5, mt: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: "#FAF8F3" }}>
          <Avatar
            src={doctor.photoUrl ?? undefined}
            sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 24 }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{doctor.fullName}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {doctor.specialisation || "—"}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {doctor.deactivatedAt ? (
                <StatusChip label="Deactivated" tone="muted" />
              ) : (
                <StatusChip label={DUTY_LABEL[status]} tone={DUTY_TONE[status]} />
              )}
              {departmentName && <Chip size="small" label={departmentName} sx={{ bgcolor: "#E8EEF5", fontSize: 11 }} />}
            </Box>
          </Box>
        </Card>

        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 1,
            }}
          >
            Credentials
          </Typography>
          <Row label="Council reg" value={<Typography sx={{ fontSize: 13, fontFamily: "ui-monospace, monospace" }}>{doctor.councilReg}</Typography>} />
          <Row label="Council" value={<Typography sx={{ fontSize: 14 }}>{doctor.council}</Typography>} />
          <Row
            label="Qualifications"
            value={
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {doctor.qualifications.map((q) => (
                  <Chip key={q} size="small" label={q} sx={{ bgcolor: "#F2EEE6", fontSize: 11 }} />
                ))}
              </Box>
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 1,
          }}
        >
          Assignment
        </Typography>
        <Row label="Department" value={<Typography sx={{ fontSize: 14 }}>{departmentName ?? "—"}</Typography>} />
        <Row label="OPD room" value={<Typography sx={{ fontSize: 14 }}>{doctor.opdRoom || "—"}</Typography>} />
        <Row label="Joined" value={<Typography sx={{ fontSize: 14 }}>{formatIst(doctor.joinedAt, "dd MMM yyyy")}</Typography>} />

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 1,
          }}
        >
          Contact
        </Typography>
        <Row label="Mobile" value={<Typography sx={{ fontSize: 14 }}>+91 {doctor.phone}</Typography>} />
        <Row label="Email" value={<Typography sx={{ fontSize: 14 }}>{doctor.email}</Typography>} />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Consultation timings
          </Typography>
        </Box>
        {doctor.consultationSchedule ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {DAYS.map((day) => {
              const d = doctor.consultationSchedule![day];
              return (
                <Box
                  key={day}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr",
                    gap: 1.5,
                    py: 0.75,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{day}</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {d.off ? (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Off</Typography>
                    ) : d.slots.length === 0 ? (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                    ) : (
                      d.slots.map((s, i) => (
                        <Chip
                          key={i}
                          size="small"
                          label={`${s.from} – ${s.to}`}
                          sx={{ bgcolor: "#E8EEF5", color: "primary.main", fontSize: 11, fontFamily: "ui-monospace, monospace" }}
                        />
                      ))
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No schedule set.
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
