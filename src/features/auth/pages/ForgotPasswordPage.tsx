import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PublicShell } from "@/shared/layouts/PublicShell";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/forgotPasswordSchema";
import { useForgotPassword } from "../api/useForgotPassword";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
    setSent(true);
  });

  if (sent) {
    return (
      <PublicShell>
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "#E8EEF5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 36, color: "primary.main" }} />
          </Box>
          <Typography
            variant="h2"
            sx={{ fontSize: 20, fontWeight: 600, color: "primary.main", mb: 1 }}
          >
            Check your email
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            If an account exists for that email, a reset link has been sent. The
            link is valid for 30 minutes.
          </Typography>
          <Link
            component={RouterLink}
            to="/sign-in"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 500,
            }}
          >
            <ArrowBackIcon fontSize="small" />
            Back to sign in
          </Link>
        </Box>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600, mb: 0.5 }}>
        Reset your password
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
        Enter the email associated with your account. We'll send you a reset
        link.
      </Typography>

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
              autoFocus
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
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <Box sx={{ textAlign: "center", mt: 2.5 }}>
        <Link
          component={RouterLink}
          to="/sign-in"
          underline="hover"
          variant="body2"
        >
          Back to sign in
        </Link>
      </Box>
    </PublicShell>
  );
}
