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
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-start" },
        justifyContent: "space-between",
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 22, sm: 26, md: 28 },
              fontWeight: 600,
              lineHeight: 1.25,
              wordBreak: "break-word",
            }}
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
      {action && (
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,
            "& > *": { width: { xs: "100%", sm: "auto" } },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}
