import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {c.to && !last ? (
              <Link
                component={RouterLink}
                to={c.to}
                underline="hover"
                sx={{ fontSize: 13, color: "text.secondary" }}
              >
                {c.label}
              </Link>
            ) : (
              <Typography
                sx={{
                  fontSize: 13,
                  color: last ? "text.primary" : "text.secondary",
                  fontWeight: last ? 500 : 400,
                }}
              >
                {c.label}
              </Typography>
            )}
            {!last && (
              <ChevronRightIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
