import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FlagIcon from '@mui/icons-material/Flag';
import { AMBULANCE_TYPE_INFO, EQUIPMENT_SUGGESTIONS } from '../data';
import type {
  AmbulanceType,
  AmbulanceStatus,
  ApiAmbulance,
  CreateAmbulanceInput,
} from '../../api/ambulances';

const STATUS_OPTIONS: AmbulanceStatus[] = [
  'Available',
  'On Duty',
  'Under Maintenance',
  'Out of Service',
];

const TONE_BG: Record<AmbulanceStatus, { bg: string; border: string; fg: string }> = {
  Available: { bg: '#D1E7DD', border: '#0F5132', fg: '#0F5132' },
  'On Duty': { bg: '#CFE2FF', border: '#0B5394', fg: '#0B5394' },
  'Under Maintenance': { bg: '#FFF3CD', border: '#8B5A00', fg: '#8B5A00' },
  'Out of Service': { bg: '#F8D7DA', border: '#842029', fg: '#842029' },
};

function SectionHeader({ Icon, title }: { Icon: typeof PersonIcon; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, mb: 2 }}>
      <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
      <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </Typography>
    </Box>
  );
}

export function RegisterAmbulanceDrawer({
  open,
  mode = 'add',
  initial,
  isPending = false,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  mode?: 'add' | 'edit';
  initial?: ApiAmbulance | null;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateAmbulanceInput) => void;
}) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [type, setType] = useState<AmbulanceType | ''>('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [status, setStatus] = useState<AmbulanceStatus>('Available');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setVehicleNumber(initial.vehicleNumber);
      setType(initial.type);
      setDriverName(initial.driverName);
      setDriverPhone(initial.driverPhone);
      setEquipment(initial.equipment);
      setStatus(initial.status);
    } else {
      setVehicleNumber('');
      setType('');
      setDriverName('');
      setDriverPhone('');
      setEquipment([]);
      setStatus('Available');
    }
  }, [open, mode, initial]);

  const valid =
    /^[A-Z0-9-]{6,}$/i.test(vehicleNumber.replace(/\s/g, '')) &&
    type &&
    driverName.trim().length > 1 &&
    driverPhone.length > 7 &&
    equipment.length > 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCancel}
      PaperProps={{ sx: { width: 640, display: 'flex', flexDirection: 'column' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {mode === 'edit' ? 'Edit ambulance' : 'Register a new ambulance'}
        </Typography>
        <IconButton size="small" onClick={onCancel} aria-label="Close" disabled={isPending}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 3 }}>
        <SectionHeader Icon={DirectionsCarIcon} title="Vehicle" />
        <TextField
          label="Vehicle registration number"
          required
          fullWidth
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          helperText="Enter the official RTO number, e.g., MH-12-AB-3456."
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Type"
          required
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value as AmbulanceType)}
        >
          {(Object.keys(AMBULANCE_TYPE_INFO) as AmbulanceType[]).map((t) => {
            const info = AMBULANCE_TYPE_INFO[t];
            return (
              <MenuItem key={t} value={t} sx={{ alignItems: 'flex-start', flexDirection: 'column', py: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{t}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{info.fullName}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{info.description}</Typography>
              </MenuItem>
            );
          })}
        </TextField>

        <SectionHeader Icon={PersonIcon} title="Driver" />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Driver name"
            required
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />
          <TextField
            label="Driver phone"
            type="tel"
            required
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
          />
        </div>

        <SectionHeader Icon={MedicalServicesIcon} title="Equipment" />
        <Autocomplete
          multiple
          freeSolo
          options={EQUIPMENT_SUGGESTIONS}
          value={equipment}
          onChange={(_, v) => setEquipment(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, idx) => {
              const { key: _k, ...tagProps } = getTagProps({ index: idx });
              return <Chip key={`${option}-${idx}`} size="small" label={option} {...tagProps} />;
            })
          }
          renderInput={(p) => <TextField {...p} label="Equipment list" required helperText="Pick from suggestions or add custom items." />}
        />

        <SectionHeader Icon={FlagIcon} title="Status" />
        <div className="grid grid-cols-2 gap-3">
          {STATUS_OPTIONS.map((s) => {
            const t = TONE_BG[s];
            const selected = status === s;
            return (
              <Box
                key={s}
                role="button"
                tabIndex={0}
                onClick={() => setStatus(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setStatus(s);
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 1,
                  border: '1.5px solid',
                  borderColor: selected ? t.border : 'divider',
                  bgcolor: selected ? t.bg : 'background.paper',
                  transition: 'all 120ms',
                  '&:hover': { borderColor: t.border },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.border }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: selected ? t.fg : 'inherit' }}>{s}</Typography>
                </Box>
              </Box>
            );
          })}
        </div>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" onClick={onCancel} disabled={isPending}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!valid || isPending}
          onClick={() =>
            onSubmit({
              vehicleNumber,
              type: type as AmbulanceType,
              driverName,
              driverPhone,
              equipment,
              status,
            })
          }
        >
          {isPending ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Register ambulance'}
        </Button>
      </Box>
    </Drawer>
  );
}
