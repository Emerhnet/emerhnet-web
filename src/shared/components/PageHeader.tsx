import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function PageHeader({
  title,
  subtitle,
  action,
  inlineEnd,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  inlineEnd?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 3,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: 28, fontWeight: 600, lineHeight: 1.25 }}
          >
            {title}
          </Typography>
          {inlineEnd}
        </Box>
        {subtitle && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
