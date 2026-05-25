import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DomainIcon from "@mui/icons-material/Domain";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PageHeader } from "@/shared/components/PageHeader";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { KpiCard } from "@/shared/components/KpiCard";
import { SectionCard } from "@/shared/components/SectionCard";
import { StatusChip, SOURCE_TONE } from "@/shared/components/StatusChip";
import { formatRelative } from "@/shared/lib/datetime";
import { useSuperAdminDashboard } from "../api/dashboard";

function activityIconFor(action: string) {
  if (action.endsWith(".approved")) return { Icon: CheckCircleIcon, color: "#0F5132", bg: "#D1E7DD" };
  if (action.endsWith(".rejected")) return { Icon: CancelIcon, color: "#842029", bg: "#F8D7DA" };
  if (action.endsWith(".suspended")) return { Icon: PauseCircleIcon, color: "#8B5A00", bg: "#FFF3CD" };
  if (action.startsWith("invitation.")) return { Icon: MailOutlineIcon, color: "#0B5394", bg: "#CFE2FF" };
  if (action.endsWith(".created") || action.endsWith(".updated")) return { Icon: EditNoteIcon, color: "#0B5394", bg: "#CFE2FF" };
  return { Icon: HelpOutlineIcon, color: "#595959", bg: "#F2EEE6" };
}

function ActivityIcon({ action }: { action: string }) {
  const { Icon, color, bg } = activityIconFor(action);
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        bgcolor: bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 16, color }} />
    </Box>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard();

  if (isLoading) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home" }]} />
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={110} />
          ))}
        </div>
        <Skeleton variant="rounded" height={300} />
      </>
    );
  }
  if (isError || !data) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home" }]} />
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

  const statusPie = [
    { name: "Approved", value: data.statusBreakdown.approved, color: "#0F5132" },
    { name: "Pending", value: data.statusBreakdown.pending, color: "#8B5A00" },
    { name: "Suspended", value: data.statusBreakdown.suspended, color: "#842029" },
    { name: "Rejected", value: data.statusBreakdown.rejected, color: "#595959" },
  ];
  const statusTotal = statusPie.reduce((s, x) => s + x.value, 0);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home" }]} />
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Pending Registrations"
          value={data.kpis.pendingRegistrations}
          icon={<PendingActionsIcon sx={{ fontSize: 24 }} />}
        />
        <KpiCard
          label="Approved Hospitals"
          value={data.kpis.approvedHospitals}
          icon={<DomainIcon sx={{ fontSize: 24 }} />}
        />
        <KpiCard
          label="Total Doctors"
          value={data.kpis.totalDoctors.toLocaleString()}
          icon={<MedicalServicesIcon sx={{ fontSize: 24 }} />}
        />
        <KpiCard
          label="Total Ambulances"
          value={data.kpis.totalAmbulances}
          icon={<LocalShippingIcon sx={{ fontSize: 24 }} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <Box sx={{ gridColumn: { lg: "span 3" } }}>
          <SectionCard
            title="Pending Registrations Queue"
            bodyPadding={0}
            action={
              <Link
                component={RouterLink}
                to="/admin/pending"
                underline="hover"
                sx={{ fontSize: 13, fontWeight: 500 }}
              >
                View all {data.kpis.pendingRegistrations} pending →
              </Link>
            }
          >
            {data.pendingQueue.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">No pending registrations.</Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Hospital Name", "City", "Submitted", "Source"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.pendingQueue.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontSize: 14 }}>{r.hospitalName}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{r.city}</TableCell>
                      <TableCell sx={{ fontSize: 14, color: "text.secondary" }}>
                        {formatRelative(r.createdAt)}
                      </TableCell>
                      <TableCell>
                        <StatusChip label={r.source} tone={SOURCE_TONE[r.source]} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </Box>

        <Box sx={{ gridColumn: { lg: "span 2" } }}>
          <SectionCard
            title="Recent Activity"
            action={
              <Link
                component={RouterLink}
                to="/admin/audit-log"
                underline="hover"
                sx={{ fontSize: 13, fontWeight: 500 }}
              >
                View full audit log →
              </Link>
            }
            bodyPadding={0}
          >
            {data.recentActivity.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">No recent activity.</Typography>
              </Box>
            ) : (
              <Box>
                {data.recentActivity.map((a, i) => (
                  <Box key={a.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 1.5 }}>
                      <ActivityIcon action={a.action} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap>
                          {a.action}
                          {a.hospitalName ? ` · ${a.hospitalName}` : ""}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                          {formatRelative(a.createdAt)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                        by {a.actorName}
                      </Typography>
                    </Box>
                    {i < data.recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            )}
          </SectionCard>
        </Box>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Hospitals by Status">
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPie}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusPie.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography sx={{ fontSize: 28, fontWeight: 600 }}>{statusTotal}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>total</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {statusPie.map((s) => (
                <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: s.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, flex: 1 }}>{s.name}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{s.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SectionCard>

        <SectionCard title="Rejections in the Last 30 Days">
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.rejectionsLast30d}
                margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#595959" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#595959" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <RTooltip />
                <Bar dataKey="count" fill="#842029" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {data.rejectionsLast30d.length === 0 && (
            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1, textAlign: "center" }}>
              No rejections in the last 30 days.
            </Typography>
          )}
        </SectionCard>
      </div>
    </>
  );
}
