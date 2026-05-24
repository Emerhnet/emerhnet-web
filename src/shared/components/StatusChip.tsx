import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "primary";

const TONE: Record<StatusTone, { bg: string; fg: string; dot: string }> = {
  success: { bg: "#D1E7DD", fg: "#0F5132", dot: "#0F5132" },
  warning: { bg: "#FFF3CD", fg: "#8B5A00", dot: "#8B5A00" },
  danger: { bg: "#F8D7DA", fg: "#842029", dot: "#842029" },
  info: { bg: "#CFE2FF", fg: "#0B5394", dot: "#0B5394" },
  muted: { bg: "#F2EEE6", fg: "#595959", dot: "#8C8C8C" },
  primary: { bg: "#E8EEF5", fg: "#0B2545", dot: "#0B2545" },
};

export function StatusChip({
  label,
  tone,
  size = "small",
}: {
  label: string;
  tone: StatusTone;
  size?: "small" | "medium";
}) {
  const c = TONE[tone];
  return (
    <Chip
      size={size}
      label={
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: c.dot,
              flexShrink: 0,
            }}
          />
          <span>{label}</span>
        </Box>
      }
      sx={{
        bgcolor: c.bg,
        color: c.fg,
        fontWeight: 500,
        fontSize: 12,
        height: size === "small" ? 24 : 28,
        borderRadius: "6px",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

export const HOSPITAL_STATUS_TONE = {
  Pending: "warning",
  Approved: "success",
  Suspended: "danger",
  Rejected: "danger",
} as const;

export const AMBULANCE_STATUS_TONE = {
  Available: "success",
  "On Duty": "info",
  "Under Maintenance": "warning",
  "Out of Service": "danger",
} as const;

export const DOCTOR_STATUS_TONE = {
  Active: "success",
  Deactivated: "muted",
} as const;

export const CATEGORY_TONE = {
  Government: "info",
  Private: "primary",
  Trust: "warning",
} as const;

export const SOURCE_TONE = {
  Self: "primary",
  Invited: "muted",
} as const;
