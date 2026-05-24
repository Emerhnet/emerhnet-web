import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import BusinessIcon from '@mui/icons-material/Business';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  adminContactSchema,
  type AdminContactInput,
} from '../schemas/adminContactSchema';
import { useRegistrationStore } from '../store';

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="body2"
      sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}
    >
      {children} {required && <span style={{ color: '#842029' }}>*</span>}
    </Typography>
  );
}

function CenterLabelDivider({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
    </Box>
  );
}

export function AdminContactStep() {
  const navigate = useNavigate();
  const stored = useRegistrationStore((s) => s.adminContact);
  const invite = useRegistrationStore((s) => s.invite);
  const setAdminContact = useRegistrationStore((s) => s.setAdminContact);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminContactInput>({
    resolver: zodResolver(adminContactSchema),
    defaultValues: {
      hospitalEmail: stored.hospitalEmail ?? '',
      hospitalPhone: stored.hospitalPhone ?? '',
      adminName: stored.adminName ?? '',
      adminEmail: stored.adminEmail ?? invite?.recipientEmail ?? '',
      adminPhone: stored.adminPhone ?? '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    setAdminContact(data);
    navigate('/register-hospital/documents');
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
          Register your hospital
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Provide hospital and administrator contact details.
        </Typography>
      </Box>

      <form onSubmit={onSubmit} noValidate>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <BusinessIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
            Hospital contact
          </Typography>
        </Box>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="hospitalEmail" required>
              Hospital email
            </FieldLabel>
            <Controller
              name="hospitalEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="hospitalEmail"
                  type="email"
                  placeholder="e.g. info@cityhospital.gov.in"
                  error={!!errors.hospitalEmail}
                  helperText={errors.hospitalEmail?.message}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel htmlFor="hospitalPhone" required>
              Hospital phone
            </FieldLabel>
            <Controller
              name="hospitalPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="hospitalPhone"
                  type="tel"
                  placeholder="e.g. +91 11 2345 6789"
                  error={!!errors.hospitalPhone}
                  helperText={errors.hospitalPhone?.message}
                />
              )}
            />
          </div>
        </div>

        <CenterLabelDivider label="Hospital Administrator" />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <PersonOutlineIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
            Proposed administrator
          </Typography>
        </Box>

        <Alert
          severity="info"
          icon={false}
          sx={{
            mb: 2,
            bgcolor: '#E8EEF5',
            color: 'text.primary',
            '& .MuiAlert-message': { fontSize: 14 },
          }}
        >
          This person will receive a sign-in link if your hospital is approved. They must have
          authority to act on behalf of the hospital.
        </Alert>

        <FieldLabel htmlFor="adminName" required>
          Admin name
        </FieldLabel>
        <Controller
          name="adminName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="adminName"
              placeholder="Full legal name"
              error={!!errors.adminName}
              helperText={errors.adminName?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="adminEmail" required>
              Admin email
            </FieldLabel>
            <Controller
              name="adminEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="adminEmail"
                  type="email"
                  placeholder="Official email address"
                  error={!!errors.adminEmail}
                  helperText={errors.adminEmail?.message}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel htmlFor="adminPhone" required>
              Admin phone
            </FieldLabel>
            <Controller
              name="adminPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="adminPhone"
                  type="tel"
                  placeholder="Primary mobile number"
                  error={!!errors.adminPhone}
                  helperText={errors.adminPhone?.message}
                />
              )}
            />
          </div>
        </div>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="button"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/register-hospital/address')}
            sx={{ height: 44, px: 3, fontWeight: 600 }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ height: 44, px: 3, fontWeight: 600 }}
          >
            Next: Documents
          </Button>
        </Box>
      </form>
    </Box>
  );
}
