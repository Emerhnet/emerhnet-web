import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  HOSPITAL_CATEGORIES,
  hospitalDetailsSchema,
  type HospitalCategory,
  type HospitalDetailsInput,
} from '../schemas/hospitalDetailsSchema';
import { useRegistrationStore } from '../store';

const CATEGORY_ICONS: Record<HospitalCategory, typeof AccountBalanceIcon> = {
  Government: AccountBalanceIcon,
  Private: BusinessIcon,
  Trust: VolunteerActivismIcon,
};

function FieldLabel({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <Typography component="label" htmlFor={htmlFor} variant="body2" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
      {children} {required && <span style={{ color: '#842029' }}>*</span>}
    </Typography>
  );
}

export function HospitalDetailsStep() {
  const navigate = useNavigate();
  const stored = useRegistrationStore((s) => s.hospitalDetails);
  const invite = useRegistrationStore((s) => s.invite);
  const setHospitalDetails = useRegistrationStore((s) => s.setHospitalDetails);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HospitalDetailsInput>({
    resolver: zodResolver(hospitalDetailsSchema),
    defaultValues: {
      hospitalName: stored.hospitalName ?? invite?.hospitalName ?? '',
      nin: stored.nin ?? '',
      ceaLicenceNumber: stored.ceaLicenceNumber ?? '',
      category: stored.category,
      cghsEmpanelment: stored.cghsEmpanelment,
      ayushmanEmpanelment: stored.ayushmanEmpanelment,
    },
  });

  const onSubmit = handleSubmit((data) => {
    setHospitalDetails(data);
    navigate('/register-hospital/address');
  });

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
          Register your hospital
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          All fields marked <span style={{ color: '#842029' }}>*</span> are required.
        </Typography>
      </Box>

      <Box sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 1.5, mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600 }}>
          Hospital details
        </Typography>
      </Box>

      <form onSubmit={onSubmit} noValidate>
        <FieldLabel htmlFor="hospitalName" required>
          Hospital name
        </FieldLabel>
        <Controller
          name="hospitalName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="hospitalName"
              placeholder="Enter legal hospital name"
              error={!!errors.hospitalName}
              helperText={
                errors.hospitalName?.message ??
                (invite ? 'Pre-filled from your invitation and cannot be changed.' : '')
              }
              InputProps={{ readOnly: Boolean(invite) }}
              sx={{
                mb: 2,
                ...(invite && {
                  '& .MuiOutlinedInput-root': { bgcolor: '#F5F2EC' },
                }),
              }}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <FieldLabel htmlFor="nin" required>
              NIN
            </FieldLabel>
            <Controller
              name="nin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="nin"
                  placeholder="10-digit NIN"
                  inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                  error={!!errors.nin}
                  helperText={errors.nin?.message ?? 'National Identification Number from the Health Facility Registry'}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel htmlFor="ceaLicenceNumber">Clinical Establishments Act licence number</FieldLabel>
            <Controller
              name="ceaLicenceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="ceaLicenceNumber"
                  placeholder="Enter licence number"
                  helperText="Optional. If applicable in your state"
                />
              )}
            />
          </div>
        </div>

        <Box sx={{ mt: 2 }}>
          <FieldLabel required>Category</FieldLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                {HOSPITAL_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const selected = field.value === cat;
                  return (
                    <Box
                      key={cat}
                      role="button"
                      tabIndex={0}
                      onClick={() => field.onChange(cat)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          field.onChange(cat);
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        p: 2,
                        borderRadius: 1,
                        border: '1.5px solid',
                        borderColor: selected ? 'primary.main' : 'divider',
                        bgcolor: selected ? '#E8EEF5' : 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 120ms',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <Icon sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: selected ? 600 : 500 }}>
                        {cat}
                      </Typography>
                    </Box>
                  );
                })}
              </div>
            )}
          />
          {errors.category && (
            <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
              {errors.category.message}
            </Typography>
          )}
        </Box>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <YesNoField
            name="cghsEmpanelment"
            control={control}
            label="CGHS empanelment"
            errorMsg={errors.cghsEmpanelment?.message}
          />
          <YesNoField
            name="ayushmanEmpanelment"
            control={control}
            label="Ayushman Bharat empanelment"
            errorMsg={errors.ayushmanEmpanelment?.message}
          />
        </div>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link component="button" type="button" onClick={() => navigate('/sign-in')} underline="hover" sx={{ color: 'text.secondary' }}>
            Cancel
          </Link>
          <Button type="submit" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ height: 44, px: 3, fontWeight: 600 }}>
            Next: Address & Location
          </Button>
        </Box>
      </form>
    </Box>
  );
}

function YesNoField({
  name,
  control,
  label,
  errorMsg,
}: {
  name: 'cghsEmpanelment' | 'ayushmanEmpanelment';
  control: ReturnType<typeof useForm<HospitalDetailsInput>>['control'];
  label: string;
  errorMsg?: string;
}) {
  return (
    <div>
      <FieldLabel required>{label}</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup
            exclusive
            value={field.value ?? null}
            onChange={(_, v) => v && field.onChange(v)}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                height: 40,
                fontWeight: 600,
                textTransform: 'none',
                borderColor: 'divider',
              },
              '& .Mui-selected': {
                bgcolor: 'primary.main !important',
                color: '#FFFFFF !important',
              },
            }}
          >
            <ToggleButton value="Yes">Yes</ToggleButton>
            <ToggleButton value="No">No</ToggleButton>
          </ToggleButtonGroup>
        )}
      />
      {errorMsg && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
          {errorMsg}
        </Typography>
      )}
    </div>
  );
}
