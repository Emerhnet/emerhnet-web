import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useSnackbar } from "notistack";
import { PublicShell } from "@/shared/layouts/PublicShell";
import {
  setPasswordSchema,
  type SetPasswordInput,
  checkPassword,
  passwordStrength,
  type PasswordChecks,
} from "../schemas/setPasswordSchema";
import { useSetPassword } from "../api/useSetPassword";

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"] as const;

function StrengthMeter({ score }: { score: number }) {
  const colors = ["#DCD7CD", "#842029", "#8B5A00", "#0F5132", "#0F5132"];
  const activeColor = colors[score] ?? "#DCD7CD";
  return (
    <div className="flex gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 1,
            bgcolor: i < score ? activeColor : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}

function CheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
      ) : (
        <RadioButtonUncheckedIcon
          sx={{ fontSize: 18, color: "text.disabled" }}
        />
      )}
      <Typography
        variant="body2"
        sx={{ color: ok ? "text.primary" : "text.secondary" }}
      >
        {label}
      </Typography>
    </div>
  );
}

export function SetPasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useSetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const newPassword = useWatch({ control, name: "newPassword" }) ?? "";
  const checks: PasswordChecks = checkPassword(newPassword);
  const score = passwordStrength(checks);

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync({ ...data, token });
    enqueueSnackbar("Password saved. Please sign in.", { variant: "success" });
    navigate("/sign-in");
  });

  return (
    <PublicShell showHeaderActions>
      <Typography
        variant="h2"
        sx={{ fontSize: 20, fontWeight: 600, color: "primary.main", mb: 0.5 }}
      >
        Set a new password
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
        Create a strong password to secure your account.
      </Typography>

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-1">
          <Typography
            component="label"
            htmlFor="newPassword"
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            New password <span style={{ color: "#842029" }}>*</span>
          </Typography>
        </div>
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="newPassword"
              type={showNew ? "text" : "password"}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNew((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <StrengthMeter score={score} />
        {newPassword.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            Strength: {STRENGTH_LABELS[score]}
          </Typography>
        )}

        <Box sx={{ mt: 2.5 }}>
          <div className="mb-1">
            <Typography
              component="label"
              htmlFor="confirmPassword"
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              Confirm password <span style={{ color: "#842029" }}>*</span>
            </Typography>
          </div>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm((v) => !v)}
                        edge="end"
                        size="small"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: "#F2EEE6",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <CheckItem ok={checks.length} label="At least 10 characters" />
          <CheckItem ok={checks.upper} label="Contains an uppercase letter" />
          <CheckItem ok={checks.lower} label="Contains a lowercase letter" />
          <CheckItem ok={checks.digit} label="Contains a digit" />
          <CheckItem
            ok={checks.notCompromised}
            label="Not commonly compromised"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3, height: 44, fontWeight: 600 }}
        >
          {isSubmitting ? "Saving..." : "Save password"}
        </Button>
      </form>
    </PublicShell>
  );
}
