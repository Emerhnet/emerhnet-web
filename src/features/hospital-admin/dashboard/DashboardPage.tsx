import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '@/shared/components/PageHeader';
import { KpiCard } from '@/shared/components/KpiCard';
import { SectionCard } from '@/shared/components/SectionCard';
import {
  HOSPITAL_CONTEXT,
  DOCTORS_BY_DEPARTMENT,
  DEPARTMENTS_TOTAL,
  BED_TYPES,
  AMBULANCE_STATUS,
} from '../data';

const AMBULANCE_PILL_COLORS = {
  Available: { bg: '#D1E7DD', accent: '#0F5132', fg: '#0F5132', Icon: CheckCircleIcon },
  'On Duty': { bg: '#CFE2FF', accent: '#0B5394', fg: '#0B5394', Icon: DirectionsRunIcon },
  'Under Maintenance': { bg: '#FFF3CD', accent: '#8B5A00', fg: '#8B5A00', Icon: BuildIcon },
  'Out of Service': { bg: '#F8D7DA', accent: '#842029', fg: '#842029', Icon: CancelIcon },
} as const;

function DeptBar({ name, count, max }: { name: string; count: number; max: number }) {
  const pct = (count / max) * 100;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.75 }}>
      <Typography sx={{ fontSize: 14, width: 200, flexShrink: 0 }}>{name}</Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: '#E5E7EB', borderRadius: 999, position: 'relative' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 999 }} />
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, width: 32, textAlign: 'right' }}>
        {count}
      </Typography>
    </Box>
  );
}

function BedRow({ name, total, occupied }: { name: string; total: number; occupied: number }) {
  const available = total - occupied;
  const pct = (occupied / total) * 100;
  const tone: 'normal' | 'warning' | 'danger' = pct >= 100 ? 'danger' : pct >= 85 ? 'warning' : 'normal';
  const barColor = tone === 'danger' ? '#842029' : tone === 'warning' ? '#8B5A00' : '#0B2545';
  const availColor = available === 0 ? '#842029' : '#0F5132';
  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{name}</Typography>
        <Typography sx={{ fontSize: 13 }}>
          <Box component="span" sx={{ color: 'text.secondary' }}>Total </Box>
          {total}
          <Box component="span" sx={{ color: 'text.secondary' }}> · Occupied </Box>
          {occupied}
          <Box component="span" sx={{ color: 'text.secondary' }}> · Available </Box>
          <Box component="span" sx={{ color: availColor, fontWeight: 600 }}>{available}</Box>
        </Typography>
      </Box>
      <Box sx={{ height: 6, bgcolor: '#E5E7EB', borderRadius: 999 }}>
        <Box sx={{ width: `${Math.min(pct, 100)}%`, height: '100%', bgcolor: barColor, borderRadius: 999 }} />
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
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        cursor: 'pointer',
        width: 240,
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        transition: 'all 120ms',
        '&:hover': { bgcolor: '#E8EEF5', borderColor: 'primary.main' },
      }}
    >
      <Icon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{description}</Typography>
    </Box>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const maxDept = Math.max(...DOCTORS_BY_DEPARTMENT.map((d) => d.count));
  const totalAmbulances = Object.values(AMBULANCE_STATUS).reduce((s, n) => s + n, 0);

  return (
    <>
      <PageHeader
        title={HOSPITAL_CONTEXT.name}
        subtitle={`NIN ${HOSPITAL_CONTEXT.nin} · Last profile update: ${HOSPITAL_CONTEXT.lastUpdated}`}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Active Doctors"
          value={87}
          icon={<MedicalServicesIcon />}
          change={`Across ${DEPARTMENTS_TOTAL} departments`}
          changeTone="muted"
        />
        <Card sx={{ p: 2.5, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16, color: 'primary.main' }}>
            <HotelIcon />
          </Box>
          <Typography sx={{ fontSize: 32, fontWeight: 600, lineHeight: 1.1 }}>240</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, mt: 0.5 }}>
            Total Beds
          </Typography>
          <Typography sx={{ fontSize: 12, mt: 1 }}>
            150 occupied · <Box component="span" sx={{ color: '#0F5132', fontWeight: 600 }}>90 available</Box>
          </Typography>
        </Card>
        <KpiCard
          label="Available Ambulances"
          value="4 / 6"
          icon={<LocalShippingIcon />}
          change="2 on duty"
          changeTone="muted"
        />
        <KpiCard
          label="Departments"
          value={DEPARTMENTS_TOTAL}
          icon={<ApartmentIcon />}
          change="All active"
          changeTone="muted"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <SectionCard
          title="Doctors by Department"
          action={
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/hospital/doctors')}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Manage doctors →
            </Link>
          }
        >
          {DOCTORS_BY_DEPARTMENT.map((d) => (
            <DeptBar key={d.name} name={d.name} count={d.count} max={maxDept} />
          ))}
          <Box sx={{ pt: 1.5, textAlign: 'center' }}>
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/hospital/departments')}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Show all 12 →
            </Link>
          </Box>
        </SectionCard>

        <SectionCard
          title="Bed Availability by Type"
          action={
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/hospital/beds')}
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Update counts →
            </Link>
          }
        >
          {BED_TYPES.map((b) => (
            <BedRow key={b.name} {...b} />
          ))}
        </SectionCard>
      </div>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>Ambulance Status</Typography>
        <div className="grid grid-cols-4 gap-3">
          {(Object.keys(AMBULANCE_STATUS) as (keyof typeof AMBULANCE_STATUS)[]).map((label) => {
            const c = AMBULANCE_PILL_COLORS[label];
            const count = AMBULANCE_STATUS[label];
            const empty = count === 0;
            return (
              <Box
                key={label}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  pl: 2.5,
                  pr: 2,
                  py: 1.75,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  opacity: empty ? 0.65 : 1,
                  transition: 'box-shadow 120ms',
                  '&:hover': { boxShadow: '0 2px 6px rgba(15,23,42,0.06)' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: 999,
                    bgcolor: c.accent,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: c.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <c.Icon sx={{ fontSize: 18, color: c.fg }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: 28, fontWeight: 600, color: empty ? 'text.secondary' : c.fg, lineHeight: 1.1, mt: 0.25 }}>
                    {count}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </div>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1.5 }}>
          {totalAmbulances} ambulances total. Last status update: 1h ago.
        </Typography>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>Quick actions</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <QuickActionTile
            Icon={PersonAddIcon}
            label="Add Doctor"
            description="Create a new doctor record."
            onClick={() => navigate('/hospital/doctors')}
          />
          <QuickActionTile
            Icon={EditNoteIcon}
            label="Update Bed Counts"
            description="Adjust occupied counts for any bed type."
            onClick={() => navigate('/hospital/beds')}
          />
          <QuickActionTile
            Icon={AddCircleIcon}
            label="Register Ambulance"
            description="Add a new ambulance unit to your fleet."
            onClick={() => navigate('/hospital/ambulances')}
          />
          <QuickActionTile
            Icon={SettingsIcon}
            label="Edit Hospital Profile"
            description="Update contact, address, or visiting hours."
            onClick={() => navigate('/hospital/profile')}
          />
        </Box>
      </Card>
    </>
  );
}
