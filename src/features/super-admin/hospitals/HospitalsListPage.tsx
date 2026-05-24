import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  StatusChip,
  CATEGORY_TONE,
  HOSPITAL_STATUS_TONE,
} from '@/shared/components/StatusChip';
import { formatIst, formatRelative } from '@/shared/lib/datetime';
import { INDIAN_STATES } from '@/shared/constants/indianStates';
import { useHospitals, type ApiHospital, type ApiHospitalStatus } from '../api/hospitals';

const STATUSES: ApiHospitalStatus[] = ['approved', 'pending', 'suspended', 'rejected'];
const STATUS_LABELS: Record<ApiHospitalStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  suspended: 'Suspended',
  rejected: 'Rejected',
};
const CATEGORIES = ['Government', 'Private', 'Trust'] as const;

export function HospitalsListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const statusF = (params.get('status') as ApiHospitalStatus | null) ?? undefined;
  const categoryF = (params.get('category') as 'Government' | 'Private' | 'Trust' | null) ?? undefined;
  const stateF = params.get('state') ?? undefined;
  const cghs = params.get('cghs') === '1';
  const ayushman = params.get('ayushman') === '1';

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useHospitals({
    status: statusF,
    category: categoryF,
    state: stateF,
    cghs: cghs || undefined,
    ayushman: ayushman || undefined,
    search: q || undefined,
  });

  const rows = data?.items ?? [];
  const hasFilters = Boolean(q || statusF || categoryF || stateF || cghs || ayushman);
  const resetFilters = () => setParams(new URLSearchParams(), { replace: true });

  const columns: GridColDef<ApiHospital>[] = [
    {
      field: 'hospitalName',
      headerName: 'Hospital',
      flex: 1.6,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>
            {row.hospitalName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>NIN: {row.nin}</Typography>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 160,
      valueGetter: (_val, row) => `${row.address.city}, ${row.address.state}`,
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: 14 }}>
          {row.address.city}, {row.address.state}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip label={row.category} tone={CATEGORY_TONE[row.category]} />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip
          label={STATUS_LABELS[row.status]}
          tone={HOSPITAL_STATUS_TONE[STATUS_LABELS[row.status]]}
        />
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Tooltip title={formatIst(row.updatedAt)}>
          <span>{formatRelative(row.updatedAt)}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Hospitals"
        subtitle="All hospitals registered on the EMERHNET platform."
        action={
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => enqueueSnackbar('Send Invitation — coming soon.', { variant: 'info' })}
            sx={{ height: 40, fontWeight: 600 }}
          >
            Send Invitation
          </Button>
        }
      />

      <Card sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          value={q}
          onChange={(e) => setParam('q', e.target.value || null)}
          placeholder="Search by name, NIN, or city"
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
          label="Status"
          value={statusF ?? 'all'}
          onChange={(e) => setParam('status', e.target.value === 'all' ? null : e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Category"
          value={categoryF ?? 'all'}
          onChange={(e) => setParam('category', e.target.value === 'all' ? null : e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="State"
          value={stateF ?? 'all'}
          onChange={(e) => setParam('state', e.target.value === 'all' ? null : e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All states</MenuItem>
          {INDIAN_STATES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch size="small" checked={cghs} onChange={(e) => setParam('cghs', e.target.checked ? '1' : null)} />}
          label={<Typography sx={{ fontSize: 13 }}>CGHS only</Typography>}
        />
        <FormControlLabel
          control={<Switch size="small" checked={ayushman} onChange={(e) => setParam('ayushman', e.target.checked ? '1' : null)} />}
          label={<Typography sx={{ fontSize: 13 }}>Ayushman Bharat only</Typography>}
        />
        <Box sx={{ flex: 1 }} />
        {hasFilters && (
          <Link
            component="button"
            type="button"
            onClick={resetFilters}
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 13, fontWeight: 500 }}
          >
            <RefreshIcon fontSize="small" /> Reset
          </Link>
        )}
      </Card>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button size="small" onClick={() => void refetch()}>Retry</Button>
        }>
          Failed to load hospitals.
        </Alert>
      )}

      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1 }} />)}
        </Card>
      ) : (
        <Card sx={{ overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={56}
            getRowId={(r) => r.id}
            initialState={{ pagination: { paginationModel: { pageSize: 20, page: 0 } } }}
            pageSizeOptions={[20, 50, 100]}
            disableRowSelectionOnClick
            autoHeight
            onRowClick={(p) => navigate(`/admin/hospitals/${p.row.id}`)}
            sx={{
              border: 'none',
              cursor: 'pointer',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'text.secondary',
              },
              '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
              '& .MuiDataGrid-row:hover': { bgcolor: '#FAFAFA' },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        </Card>
      )}

      {!isLoading && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          Showing {rows.length} of {data?.total ?? 0}.
        </Typography>
      )}
    </>
  );
}
