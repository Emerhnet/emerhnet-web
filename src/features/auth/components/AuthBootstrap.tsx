import { useEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthStore } from "../store";
import { fetchMe } from "../api/useMe";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const user = await fetchMe();
      if (cancelled) return;
      if (user) setUser(user);
      else clear();
      setBootstrapped(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [setUser, clear, setBootstrapped]);

  if (!isBootstrapped) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FAF7F2",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
