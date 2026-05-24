import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { useAuthStore, type AuthUser } from "@/features/auth/store";

export function RequireRole({
  role,
  children,
}: {
  role: AuthUser["role"];
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.role !== role) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <LockIcon sx={{ fontSize: 56, color: "text.secondary", mb: 1.5 }} />
        <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 600, mb: 1 }}>
          403 — Access denied
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          You don't have permission to view this page.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/sign-in">
          Back to sign in
        </Button>
      </Box>
    );
  }
  return <>{children}</>;
}
