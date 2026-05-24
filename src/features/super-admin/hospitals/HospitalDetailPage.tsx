import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import BlockIcon from '@mui/icons-material/Block';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { SectionCard } from '@/shared/components/SectionCard';
import {
  StatusChip,
  CATEGORY_TONE,
  HOSPITAL_STATUS_TONE,
} from '@/shared/components/StatusChip';
import { formatIst } from '@/shared/lib/datetime';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import {
  useHospital,
  useSuspendHospital,
  useReactivateHospital,
  type ApiHospital,
} from '../api/hospitals';
import { SuspendDialog } from './components/SuspendDialog';

const TAB_LABELS = ['Overview', 'Doctors', 'Departments', 'Beds', 'Ambulances', 'Documents', 'Audit Log'];

const STATUS_LABELS: Record<string, string> = {
  approved: 'Approved',
  pending: 'Pending',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

function ReadRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>{value || '—'}</Typography>
    </div>
  );
}

function OverviewTab({ hospital }: { hospital: ApiHospital }) {
  const { address, contact, adminContact } = hospital;
  const initials = adminContact.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="grid grid-cols-5 gap-4">
      <Box sx={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SectionCard
          title="Hospital Profile"
          action={
            <Link component="button" type="button" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 13, fontWeight: 500 }}>
              <EditIcon fontSize="small" />
              Edit Details
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <ReadRow label="Hospital Name" value={hospital.hospitalName} />
            <ReadRow label="NIN" value={hospital.nin} />
            <ReadRow label="CEA Licence" value={hospital.ceaLicenceNumber || '—'} />
            <ReadRow label="Category" value={hospital.category} />
            <ReadRow label="CGHS" value={hospital.cghsEmpanelment ? 'Yes' : 'No'} />
            <ReadRow label="Ayushman Bharat" value={hospital.ayushmanEmpanelment ? 'Yes' : 'No'} />
            <ReadRow label="Hospital Email" value={contact.email} />
            <ReadRow label="Hospital Phone" value={contact.phone} />
            <ReadRow label="Address" value={`${address.line1}${address.line2 ? ', ' + address.line2 : ''}`} />
            <ReadRow label="Pincode" value={address.pincode} />
            <ReadRow label="State" value={address.state} />
            <ReadRow label="City" value={address.city} />
            <ReadRow label="Submitted" value={formatIst(hospital.createdAt)} />
            <ReadRow label="Tracking ID" value={hospital.trackingId} />
          </div>
        </SectionCard>

        <SectionCard title="Hospital Admin">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 18 }}>
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{adminContact.name}</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Hospital Admin</Typography>
              <Box sx={{ display: 'flex', gap: 3, mt: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 13 }}>{adminContact.email}</Typography>
                <Typography sx={{ fontSize: 13 }}>{adminContact.phone}</Typography>
              </Box>
            </Box>
          </Box>
        </SectionCard>
      </Box>

      <Box sx={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'relative',
              height: 200,
              bgcolor: '#EEF2F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Number.isFinite(address.latitude) && Number.isFinite(address.longitude) ? (
              <iframe
                key={`${address.latitude},${address.longitude}`}
                title="Hospital location"
                src={(() => {
                  const la = Number(address.latitude);
                  const lo = Number(address.longitude);
                  const d = 0.01;
                  return `https://www.openstreetmap.org/export/embed.html?bbox=${lo - d}%2C${la - d}%2C${lo + d}%2C${la + d}&layer=mapnik&marker=${la}%2C${lo}`;
                })()}
                style={{ border: 0, width: '100%', height: '100%' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No coordinates on file
              </Typography>
            )}
          </Box>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, display: 'block' }}>
                Current coordinates
              </Typography>
              <Typography sx={{ fontSize: 13, fontFamily: 'ui-monospace, monospace', mt: 0.25 }}>
                {address.latitude}° N, {address.longitude}° E
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${address.latitude},${address.longitude}`,
                  '_blank',
                  'noopener',
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

type StubDoctorRow = { id: string; fullName: string; councilReg: string; department: string; specialisation: string; joined: string; status: string };

function DoctorsTab() {
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const { enqueueSnackbar } = useSnackbar();

  const columns: GridColDef<StubDoctorRow>[] = [
    {
      field: 'fullName',
      headerName: 'Doctor',
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 12 }}>
            {row.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{row.fullName}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{row.councilReg}</Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 160 },
    { field: 'specialisation', headerName: 'Specialisation', flex: 1.2, minWidth: 200 },
    { field: 'joined', headerName: 'Joined', flex: 0.7, minWidth: 110 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 110,
      renderCell: ({ row }) => (
        <StatusChip label={row.status} tone={row.status === 'Active' ? 'success' : 'muted'} />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.4,
      minWidth: 80,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      filterable: false,
      renderCell: () => (
        <IconButton
          size="small"
          onClick={() => enqueueSnackbar('View audit (coming soon).', { variant: 'info' })}
          aria-label="Actions"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  void q; void department; void status;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Registered Practitioners</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Read-only view. The Hospital Admin manages this list.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => enqueueSnackbar('Export list (coming soon).', { variant: 'info' })}
          sx={{ height: 40, fontWeight: 600 }}
        >
          Export List
        </Button>
      </Box>
      <Card sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or council reg"
          size="small"
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ width: 220 }}
        >
          <MenuItem value="All">All</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Deactivated">Deactivated</MenuItem>
        </TextField>
      </Card>
      <Card sx={{ overflow: 'hidden' }}>
        <DataGrid
          rows={[]}
          columns={columns}
          rowHeight={56}
          getRowId={(r) => r.id}
          initialState={{ pagination: { paginationModel: { pageSize: 20, page: 0 } } }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: 13, fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '0.04em', color: 'text.secondary',
            },
            '& .MuiDataGrid-row:hover': { bgcolor: '#FAFAFA' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
          }}
        />
      </Card>
    </>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <Card sx={{ p: 6, textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Coming soon.
      </Typography>
    </Card>
  );
}

export function HospitalDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
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
      enqueueSnackbar(`${hospital?.hospitalName ?? 'Hospital'} suspended.`, { variant: 'success' });
      navigate('/admin/hospitals');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync(id);
      enqueueSnackbar(`${hospital?.hospitalName ?? 'Hospital'} reactivated.`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Hospitals', to: '/admin/hospitals' }, { label: '…' }]} />
        <Skeleton height={40} sx={{ mt: 2, maxWidth: 400 }} />
        <Skeleton height={300} sx={{ mt: 2 }} />
      </>
    );
  }

  if (isError || !hospital) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Hospitals', to: '/admin/hospitals' }, { label: 'Error' }]} />
        <Alert severity="error" sx={{ mt: 2 }}>Failed to load hospital details.</Alert>
      </>
    );
  }

  const statusLabel = STATUS_LABELS[hospital.status] ?? hospital.status;
  const isSuspended = hospital.status === 'suspended';

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/admin/dashboard' },
          { label: 'Hospitals', to: '/admin/hospitals' },
          { label: hospital.hospitalName },
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 600, mb: 1 }}>
            {hospital.hospitalName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>NIN: {hospital.nin}</Typography>
            <StatusChip label={hospital.category} tone={CATEGORY_TONE[hospital.category]} />
            <StatusChip label={statusLabel} tone={HOSPITAL_STATUS_TONE[statusLabel]} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {isSuspended ? (
            <Button
              variant="outlined"
              startIcon={<PlayCircleIcon />}
              onClick={() => void handleReactivate()}
              disabled={reactivateMutation.isPending}
              sx={{ height: 40, fontWeight: 600 }}
            >
              {reactivateMutation.isPending ? 'Reactivating…' : 'Reactivate'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => setSuspendOpen(true)}
              disabled={hospital.status !== 'approved'}
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
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {TAB_LABELS.map((l) => (
          <Tab key={l} label={l} sx={{ textTransform: 'none', fontWeight: 600 }} />
        ))}
      </Tabs>

      {tab === 0 && <OverviewTab hospital={hospital} />}
      {tab === 1 && <DoctorsTab />}
      {tab === 2 && <PlaceholderTab label="Departments" />}
      {tab === 3 && <PlaceholderTab label="Beds" />}
      {tab === 4 && <PlaceholderTab label="Ambulances" />}
      {tab === 5 && <PlaceholderTab label="Documents" />}
      {tab === 6 && <PlaceholderTab label="Audit Log" />}

      <SuspendDialog
        open={suspendOpen}
        hospitalName={hospital.hospitalName}
        isPending={suspendMutation.isPending}
        onCancel={() => setSuspendOpen(false)}
        onConfirm={(reason) => void handleSuspend(reason)}
      />

      {hospital.status === 'approved' && (
        <Box sx={{ display: 'none' }}>
          <CheckCircleIcon />
        </Box>
      )}
    </>
  );
}
