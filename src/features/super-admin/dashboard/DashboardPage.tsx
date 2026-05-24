import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DomainIcon from "@mui/icons-material/Domain";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
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

const KPIS = [
  {
    label: "Pending Registrations",
    value: 12,
    icon: PendingActionsIcon,
    change: "+3 this week",
  },
  {
    label: "Approved Hospitals",
    value: 147,
    icon: DomainIcon,
    change: "+5 this month",
  },
  {
    label: "Total Doctors",
    value: "2,341",
    icon: MedicalServicesIcon,
    change: "+89 this month",
  },
  {
    label: "Total Ambulances",
    value: 489,
    icon: LocalShippingIcon,
    change: "+12 this month",
  },
];

const QUEUE = [
  {
    name: "District Hospital Nashik",
    city: "Nashik",
    submitted: "2h ago",
    source: "Self" as const,
  },
  {
    name: "Civil Hospital Aurangabad",
    city: "Aurangabad",
    submitted: "5h ago",
    source: "Invited" as const,
  },
  {
    name: "Sub-District Hospital Solapur",
    city: "Solapur",
    submitted: "1d ago",
    source: "Self" as const,
  },
  {
    name: "Government Medical College Kolhapur",
    city: "Kolhapur",
    submitted: "2d ago",
    source: "Invited" as const,
  },
  {
    name: "Rural Hospital Sangli",
    city: "Sangli",
    submitted: "3d ago",
    source: "Self" as const,
  },
];

type ActivityKind = "approved" | "rejected" | "invitation" | "suspended";

const ACTIVITY: {
  kind: ActivityKind;
  text: string;
  when: string;
  actor: string;
}[] = [
  {
    kind: "approved",
    text: "Approved General Hospital, Pune",
    when: "2h ago",
    actor: "Tushar D.",
  },
  {
    kind: "invitation",
    text: "Invitation sent to Civil Hospital, Latur",
    when: "4h ago",
    actor: "Tushar D.",
  },
  {
    kind: "rejected",
    text: "Rejected ABC Clinic, Mumbai",
    when: "1d ago",
    actor: "Priya M.",
  },
  {
    kind: "suspended",
    text: "Suspended XYZ Hospital, Nagpur",
    when: "2d ago",
    actor: "Tushar D.",
  },
  {
    kind: "approved",
    text: "Approved District Hospital, Satara",
    when: "2d ago",
    actor: "Priya M.",
  },
  {
    kind: "invitation",
    text: "Invitation sent to Government Medical College, Sangli",
    when: "3d ago",
    actor: "Tushar D.",
  },
];

const STATUS_PIE = [
  { name: "Approved", value: 147, color: "#0F5132" },
  { name: "Pending", value: 12, color: "#8B5A00" },
  { name: "Suspended", value: 3, color: "#842029" },
  { name: "Rejected", value: 2, color: "#842029" },
];
const STATUS_TOTAL = STATUS_PIE.reduce((s, x) => s + x.value, 0);

const REJECTIONS = [
  { week: "Wk 1", count: 1 },
  { week: "Wk 2", count: 3 },
  { week: "Wk 3", count: 0 },
  { week: "Wk 4", count: 2 },
];

function ActivityIcon({ kind }: { kind: ActivityKind }) {
  const map = {
    approved: { Icon: CheckCircleIcon, color: "#0F5132", bg: "#D1E7DD" },
    rejected: { Icon: CancelIcon, color: "#842029", bg: "#F8D7DA" },
    invitation: { Icon: MailOutlineIcon, color: "#0B5394", bg: "#CFE2FF" },
    suspended: { Icon: PauseCircleIcon, color: "#8B5A00", bg: "#FFF3CD" },
  } as const;
  const { Icon, color, bg } = map[kind];
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
  return (
    <>
      <Breadcrumbs items={[{ label: "Home" }]} />
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPIS.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            icon={<k.icon sx={{ fontSize: 24 }} />}
            change={k.change}
            changeTone="success"
          />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Box sx={{ gridColumn: "span 3" }}>
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
                View all 12 pending →
              </Link>
            }
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Hospital Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    City
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Submitted
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Source
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {QUEUE.map((r) => (
                  <TableRow key={r.name} hover>
                    <TableCell sx={{ fontSize: 14 }}>{r.name}</TableCell>
                    <TableCell sx={{ fontSize: 14 }}>{r.city}</TableCell>
                    <TableCell sx={{ fontSize: 14, color: "text.secondary" }}>
                      {r.submitted}
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        label={r.source}
                        tone={SOURCE_TONE[r.source]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </Box>

        <Box sx={{ gridColumn: "span 2" }}>
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
            <Box>
              {ACTIVITY.map((a, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    <ActivityIcon kind={a.kind} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap>
                        {a.text}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12, color: "text.secondary" }}
                      >
                        {a.when}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      by {a.actor}
                    </Typography>
                  </Box>
                  {i < ACTIVITY.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Box>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard title="Hospitals by Status">
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                position: "relative",
                width: 220,
                height: 220,
                flexShrink: 0,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_PIE}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {STATUS_PIE.map((s) => (
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
                <Typography sx={{ fontSize: 28, fontWeight: 600 }}>
                  {STATUS_TOTAL}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  total
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              {STATUS_PIE.map((s) => (
                <Box
                  key={s.name}
                  sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: s.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, flex: 1 }}>
                    {s.name}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {s.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SectionCard>

        <SectionCard title="Rejections in the Last 30 Days">
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REJECTIONS}
                margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#595959" }}
                  axisLine={false}
                  tickLine={false}
                />
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
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>
            Click a bar to filter the audit log.
          </Typography>
        </SectionCard>
      </div>
    </>
  );
}
