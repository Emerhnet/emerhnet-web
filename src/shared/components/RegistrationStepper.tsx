import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CheckIcon from '@mui/icons-material/Check';

export const REGISTRATION_STEPS = [
  { key: 'details', label: 'Hospital Details', path: '/register-hospital' },
  { key: 'address', label: 'Address & Location', path: '/register-hospital/address' },
  { key: 'admin', label: 'Admin Contact', path: '/register-hospital/admin' },
  { key: 'documents', label: 'Documents', path: '/register-hospital/documents' },
] as const;

function StepCircle({
  index,
  state,
}: {
  index: number;
  state: 'active' | 'completed' | 'future';
}) {
  const bg =
    state === 'active' || state === 'completed' ? 'primary.main' : 'transparent';
  const color = state === 'future' ? 'text.secondary' : '#FFFFFF';
  const border = state === 'future' ? '1px solid' : 'none';

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: bg,
        color,
        border,
        borderColor: 'divider',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {state === 'completed' ? <CheckIcon sx={{ fontSize: 18 }} /> : index + 1}
    </Box>
  );
}

export function RegistrationStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <Stepper activeStep={activeIndex} alternativeLabel>
      {REGISTRATION_STEPS.map((s, i) => {
        const state: 'active' | 'completed' | 'future' =
          i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'future';
        return (
          <Step key={s.key}>
            <StepLabel
              StepIconComponent={() => <StepCircle index={i} state={state} />}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: 13,
                  fontWeight: state === 'active' ? 600 : 500,
                  color: state === 'future' ? 'text.secondary' : 'text.primary',
                  mt: 1,
                },
              }}
            >
              {s.label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
