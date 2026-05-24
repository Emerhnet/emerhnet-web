import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import { PublicShell } from "@/shared/layouts/PublicShell";
import { signInSchema, type SignInInput } from "../schemas/signInSchema";
import { useSignIn } from "../api/useSignIn";
import { useAuthStore } from "../store";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      const user = await mutation.mutateAsync(data);
      setUser(user);
      enqueueSnackbar(`Signed in as ${user.role}.`, { variant: "success" });
      navigate(
        user.role === "superAdmin" ? "/admin/dashboard" : "/hospital/dashboard",
      );
    } catch (e) {
      const msg = getApiErrorMessage(e, "Invalid email or password.");
      setSubmitError(msg);
      enqueueSnackbar(msg, { variant: "error" });
    }
  });

  return (
    <PublicShell showHeaderActions showGalasFooterLine>
      <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600, mb: 0.5 }}>
        Sign in
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
        Use your registered email and password.
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-1">
          <Typography
            component="label"
            htmlFor="email"
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Email address <span style={{ color: "#842029" }}>*</span>
          </Typography>
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="email"
              type="email"
              placeholder="name@hospital.gov.in"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              sx={{ mb: 2 }}
            />
          )}
        />

        <div className="flex justify-between items-center mb-1">
          <Typography
            component="label"
            htmlFor="password"
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Password <span style={{ color: "#842029" }}>*</span>
          </Typography>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            underline="hover"
          >
            Forgot password?
          </Link>
        </div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="password"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3, height: 44, fontWeight: 600 }}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "text.secondary", mb: 1.5 }}
      >
        New to EMERHNET?
      </Typography>
      <Button
        component={RouterLink}
        to="/register-hospital"
        variant="outlined"
        fullWidth
        sx={{ height: 44, fontWeight: 600 }}
      >
        Create an account
      </Button>
    </PublicShell>
  );
}
