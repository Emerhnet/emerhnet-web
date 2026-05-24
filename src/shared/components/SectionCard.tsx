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
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
        {action}
      </Box>
      <Divider />
      <Box sx={{ p: bodyPadding }}>{children}</Box>
    </Card>
  );
}
