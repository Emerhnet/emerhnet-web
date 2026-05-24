import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatusChip, type StatusTone } from '@/shared/components/StatusChip';
import { formatIst, formatRelative } from '@/shared/lib/datetime';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import {
  useInvitations,
  useSendInvitation,
  useReissueInvitation,
  useCancelInvitation,
  type ApiInvitation,
  type ApiInvitationStatus,
} from '../api/invitations';
import { SendInvitationDialog } from './components/SendInvitationDialog';

const STATUS_LABELS: Record<ApiInvitationStatus, string> = {
  sent: 'Sent',
  opened: 'Opened',
  submitted: 'Submitted',
  approved: 'Approved',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const STATUS_TONE: Record<ApiInvitationStatus, StatusTone> = {
  sent: 'info',
  opened: 'primary',
  submitted: 'warning',
  approved: 'success',
  expired: 'danger',
  cancelled: 'muted',
};

const STATUSES: ApiInvitationStatus[] = [
  'sent',
  'opened',
  'submitted',
  'approved',
  'expired',
  'cancelled',
];

function expiresIn(iso: string, status: ApiInvitationStatus): { text: string; tone: 'normal' | 'warning' | 'danger' } {
  if (status === 'submitted' || status === 'approved' || status === 'cancelled') {
    return { text: '—', tone: 'normal' };
  }
  const expires = new Date(iso).getTime();
  const now = Date.now();
  const diff = expires - now;
  if (diff <= 0) return { text: 'Expired', tone: 'danger' };
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const tone: 'normal' | 'warning' | 'danger' = days < 2 ? 'warning' : 'normal';
  return { text: `In ${days}d ${hours}h`, tone };
}

const EXPIRES_COLOR: Record<'normal' | 'warning' | 'danger', string> = {
  normal: 'inherit',
  warning: '#8B5A00',
  danger: '#842029',
};

function RowMenu({
  onReissue,
  onCancel,
  canMutate,
}: {
  onReissue: () => void;
  onCancel: () => void;
  canMutate: boolean;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} aria-label="Actions">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem
          disabled={!canMutate}
          onClick={() => {
            setAnchor(null);
            onReissue();
          }}
        >
          Reissue
        </MenuItem>
        <MenuItem
          disabled={!canMutate}
          onClick={() => {
            setAnchor(null);
            onCancel();
          }}
          sx={{ color: 'error.main' }}
        >
          Cancel
        </MenuItem>
      </Menu>
    </>
  );
}

export function InvitationsPage() {
  const [params, setParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [sendOpen, setSendOpen] = useState(false);

  const q = params.get('q') ?? '';
  const statusParam = params.get('status') ?? '';
  const status = (STATUSES as string[]).includes(statusParam)
    ? (statusParam as ApiInvitationStatus)
    : undefined;
  const fromStr = params.get('from') ?? undefined;
  const toStr = params.get('to') ?? undefined;
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useInvitations({
    status,
    search: q || undefined,
    from: fromStr,
    to: toStr,
  });

  const sendMutation = useSendInvitation();
  const reissueMutation = useReissueInvitation();
  const cancelMutation = useCancelInvitation();

  const rows = data?.items ?? [];
  const hasFilters = Boolean(q || status || fromStr || toStr);
  const resetFilters = () => setParams(new URLSearchParams(), { replace: true });

  const handleSend = async (p: {
    hospitalName: string;
    recipientEmail: string;
    recipientRole: string;
    internalNotes: string;
    verificationNotes: string;
  }) => {
    try {
      const result = await sendMutation.mutateAsync(p);
      setSendOpen(false);
      enqueueSnackbar(
        result.emailSent
          ? `Invitation sent to ${result.invitation.recipientEmail}.`
          : `Invitation created, but email delivery failed. Please retry.`,
        { variant: result.emailSent ? 'success' : 'warning' },
      );
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleReissue = async (row: ApiInvitation) => {
    try {
      const result = await reissueMutation.mutateAsync(row.id);
      enqueueSnackbar(
        result.emailSent
          ? `Reissued to ${row.recipientEmail}.`
          : `Reissued, but email delivery failed.`,
        { variant: result.emailSent ? 'success' : 'warning' },
      );
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleCancel = async (row: ApiInvitation) => {
    try {
      await cancelMutation.mutateAsync(row.id);
      enqueueSnackbar(`Cancelled invitation to ${row.recipientEmail}.`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const columns: GridColDef<ApiInvitation>[] = [
    { field: 'recipientEmail', headerName: 'Recipient Email', flex: 1.4, minWidth: 240 },
    { field: 'hospitalName', headerName: 'Hospital Name', flex: 1.4, minWidth: 220 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ row }) => (
        <StatusChip label={STATUS_LABELS[row.status]} tone={STATUS_TONE[row.status]} />
      ),
    },
    {
      field: 'sent',
      headerName: 'Sent',
      flex: 0.7,
      minWidth: 110,
      valueGetter: (_v, row) => row.createdAt,
      renderCell: ({ row }) => (
        <Tooltip title={formatIst(row.createdAt)}>
          <span>{formatRelative(row.createdAt)}</span>
        </Tooltip>
      ),
    },
    {
      field: 'expiresIn',
      headerName: 'Expires In',
      flex: 0.8,
      minWidth: 130,
      sortable: false,
      renderCell: ({ row }) => {
        const e = expiresIn(row.expiresAt, row.status);
        return (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: e.tone !== 'normal' ? 600 : 400,
              color: EXPIRES_COLOR[e.tone],
            }}
          >
            {e.text}
          </Typography>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.4,
      minWidth: 80,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const canMutate = row.status === 'sent' || row.status === 'opened' || row.status === 'expired';
        return (
          <RowMenu
            canMutate={canMutate}
            onReissue={() => handleReissue(row)}
            onCancel={() => handleCancel(row)}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Invitations"
        subtitle="Hospitals invited to enrol on EMERHNET. Invitations expire 7 days after they are sent."
        action={
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setSendOpen(true)}
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
          placeholder="Search by email or hospital name"
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
          value={status ?? 'all'}
          onChange={(e) => setParam('status', e.target.value === 'all' ? null : e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label="From"
          value={from}
          onChange={(d) => setParam('from', d ? d.toISOString().slice(0, 10) : null)}
          slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
        />
        <DatePicker
          label="To"
          value={to}
          onChange={(d) => setParam('to', d ? d.toISOString().slice(0, 10) : null)}
          slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
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
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load invitations.
        </Alert>
      )}

      {isLoading ? (
        <Card sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={56} sx={{ mb: 1 }} />
          ))}
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
            sx={{
              border: 'none',
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

      <SendInvitationDialog
        open={sendOpen}
        isPending={sendMutation.isPending}
        onCancel={() => setSendOpen(false)}
        onConfirm={handleSend}
      />
    </>
  );
}
