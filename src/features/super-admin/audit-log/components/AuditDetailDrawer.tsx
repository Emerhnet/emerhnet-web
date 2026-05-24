import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";
import { StatusChip, type StatusTone } from "@/shared/components/StatusChip";
import { formatIst } from "@/shared/lib/datetime";
import type { ApiAuditEntry } from "../../api/auditLog";

function tone(action: string): StatusTone {
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
    action.endsWith(".cancelled") ||
    action.endsWith(".account_locked")
  )
    return "danger";
  if (action.endsWith(".failed") || action.endsWith(".expired"))
    return "warning";
  if (action.startsWith("auth.")) return "info";
  if (action.startsWith("export.")) return "primary";
  return "muted";
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 2, py: 1 }}
    >
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

function JsonBlock({ data, bg }: { data: unknown; bg: string }) {
  if (data === null || data === undefined) {
    return (
      <Box
        component="pre"
        sx={{
          mt: 0.5,
          p: 1.5,
          bgcolor: bg,
          borderRadius: 1,
          fontSize: 12,
          m: 0,
          color: "text.secondary",
        }}
      >
        —
      </Box>
    );
  }
  return (
    <Box
      component="pre"
      sx={{
        mt: 0.5,
        p: 1.5,
        bgcolor: bg,
        borderRadius: 1,
        fontSize: 12,
        fontFamily: "ui-monospace, monospace",
        overflow: "auto",
        m: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </Box>
  );
}

export function AuditDetailDrawer({
  entry,
  onClose,
}: {
  entry: ApiAuditEntry | null;
  onClose: () => void;
}) {
  const [showFullUa, setShowFullUa] = useState(false);
  const open = Boolean(entry);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 520, p: 0 } }}
    >
      {entry && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Audit entry detail
            </Typography>
            <IconButton size="small" onClick={onClose} aria-label="Close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {formatIst(entry.createdAt)}
              </Typography>
              <StatusChip label={entry.action} tone={tone(entry.action)} />
              {entry.entityType && (
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  {entry.entityType}
                </Typography>
              )}
            </Box>

            <Row
              label="Entry ID"
              value={
                <Typography
                  sx={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}
                >
                  {entry.id}
                </Typography>
              }
            />
            <Row
              label="Action"
              value={
                <StatusChip label={entry.action} tone={tone(entry.action)} />
              }
            />
            <Row
              label="Actor"
              value={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "primary.main",
                      fontSize: 12,
                    }}
                  >
                    {entry.actorName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "SY"}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {entry.actorName}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      {entry.actorRole}
                      {entry.actorEmail ? ` · ${entry.actorEmail}` : ""}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <Row
              label="Target"
              value={
                <Typography sx={{ fontSize: 14 }}>
                  {entry.entityType ?? "—"}
                  {entry.entityId ? ` · ${entry.entityId}` : ""}
                </Typography>
              }
            />
            <Row
              label="Hospital"
              value={
                <Typography
                  sx={{
                    fontSize: 14,
                    color: entry.hospitalName
                      ? "text.primary"
                      : "text.secondary",
                  }}
                >
                  {entry.hospitalName ?? "—"}
                </Typography>
              }
            />
            <Row
              label="Timestamp"
              value={
                <Box>
                  <Typography sx={{ fontSize: 14 }}>
                    {formatIst(entry.createdAt)}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {entry.createdAt}
                  </Typography>
                </Box>
              }
            />
            <Row
              label="Client IP"
              value={
                <Typography
                  sx={{ fontSize: 14, fontFamily: "ui-monospace, monospace" }}
                >
                  {entry.ip ?? "—"}
                </Typography>
              }
            />
            <Row
              label="User agent"
              value={
                entry.userAgent ? (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontFamily: "ui-monospace, monospace",
                        color: "text.secondary",
                        whiteSpace: showFullUa ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.userAgent}
                    </Typography>
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setShowFullUa((v) => !v)}
                      underline="hover"
                      sx={{ fontSize: 12 }}
                    >
                      {showFullUa ? "Show less" : "Show more"}
                    </Link>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    —
                  </Typography>
                )
              }
            />

            <Divider sx={{ my: 3 }} />

            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
              Change details
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 500,
                  }}
                >
                  Before
                </Typography>
                <JsonBlock data={entry.before} bg="#F2EEE6" />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 500,
                  }}
                >
                  After
                </Typography>
                <JsonBlock data={entry.after} bg="#D1E7DD" />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
