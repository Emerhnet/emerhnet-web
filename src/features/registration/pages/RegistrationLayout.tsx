import { useEffect } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { PublicShell } from "@/shared/layouts/PublicShell";
import {
  RegistrationStepper,
  REGISTRATION_STEPS,
} from "@/shared/components/RegistrationStepper";
import { useVerifyInvitation } from "../api/useVerifyInvitation";
import { useRegistrationStore } from "../store";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export function RegistrationLayout() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const inviteToken = params.get("invite");

  const invite = useRegistrationStore((s) => s.invite);
  const setInvite = useRegistrationStore((s) => s.setInvite);

  const {
    data: verified,
    isLoading: verifying,
    isError: inviteError,
    error,
  } = useVerifyInvitation(inviteToken);

  useEffect(() => {
    if (!verified || !inviteToken) return;
    if (invite?.token === inviteToken) return;
    setInvite({
      token: inviteToken,
      hospitalName: verified.hospitalName,
      recipientEmail: verified.recipientEmail,
      recipientRole: verified.recipientRole,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified, inviteToken]);

  if (pathname.endsWith("/submitted")) {
    return (
      <PublicShell width={480}>
        <Outlet />
      </PublicShell>
    );
  }

  const allComplete = pathname.endsWith("/review");
  const activeIndex = allComplete
    ? REGISTRATION_STEPS.length
    : Math.max(
        0,
        REGISTRATION_STEPS.findIndex((s) =>
          s.path === "/register-hospital"
            ? pathname === "/register-hospital"
            : pathname.startsWith(s.path),
        ),
      );

  const inviteNotReady =
    Boolean(inviteToken) && (verifying || invite?.token !== inviteToken);

  if (inviteNotReady && !inviteError) {
    return (
      <PublicShell width={720}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Skeleton height={40} />
          <Skeleton height={32} width="60%" />
          <Skeleton height={200} />
        </Box>
      </PublicShell>
    );
  }

  if (inviteToken && inviteError) {
    return (
      <PublicShell width={720}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error) ||
            "This invitation link is invalid or has expired."}
        </Alert>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Contact the EMERHNET team to request a new invitation.
        </Typography>
      </PublicShell>
    );
  }

  return (
    <PublicShell width={720} disableCardPadding>
      <Box sx={{ bgcolor: "background.default", px: 3, pt: 3, pb: 1 }}>
        <RegistrationStepper activeIndex={activeIndex} />
      </Box>
      {invite && (
        <Box sx={{ px: 3, pt: 1 }}>
          <Alert
            severity="info"
            icon={<MailOutlineIcon fontSize="small" />}
            sx={{ alignItems: "center" }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Invited registration for <strong>{invite.hospitalName}</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Hospital name is locked. Other details are yours to fill in.
            </Typography>
          </Alert>
        </Box>
      )}
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </PublicShell>
  );
}
