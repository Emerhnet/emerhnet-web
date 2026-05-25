import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export function SectionCard({
  title,
  action,
  children,
  bodyPadding = 3,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  bodyPadding?: number;
}) {
  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
        {action}
      </Box>
      <Divider />
      <Box sx={{ p: { xs: Math.min(bodyPadding, 2), sm: bodyPadding } }}>
        {children}
      </Box>
    </Card>
  );
}
