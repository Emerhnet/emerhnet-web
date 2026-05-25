import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export function KpiCard({
  label,
  value,
  icon,
  change,
  changeTone = "success",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeTone?: "success" | "danger" | "muted";
}) {
  const changeColor =
    changeTone === "success"
      ? "#0F5132"
      : changeTone === "danger"
        ? "#842029"
        : "#8C8C8C";

  return (
    <Card sx={{ p: { xs: 2, sm: 2.5 }, position: "relative", height: "100%" }}>
      <Box
        sx={{ position: "absolute", top: 16, right: 16, color: "primary.main" }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: { xs: 26, sm: 32 }, fontWeight: 600, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 500,
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
      {change && (
        <Typography
          sx={{ fontSize: 12, color: changeColor, fontWeight: 500, mt: 1 }}
        >
          {change}
        </Typography>
      )}
    </Card>
  );
}
