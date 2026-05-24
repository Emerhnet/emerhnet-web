import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function EmptyState({
  illustration,
  headline,
  description,
  action,
}: {
  illustration: ReactNode;
  headline: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1.5,
        py: 6,
        px: 3,
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          mb: 1,
          "& svg": { width: 140, height: 140 },
        }}
      >
        {illustration}
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{headline}</Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 380, lineHeight: 1.5 }}
      >
        {description}
      </Typography>
      {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
    </Box>
  );
}

export function PageError({
  title = "Something went wrong",
  description = "Please try again, or contact support if the issue continues.",
  onRetry,
  onReport,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onReport?: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 8,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "#F8D7DA",
          color: "#842029",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        !
      </Box>
      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{title}</Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 420 }}
      >
        {description}
      </Typography>
      {onRetry && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box>
            <button
              onClick={onRetry}
              style={{
                background: "#0B2545",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </Box>
          {onReport && (
            <button
              onClick={onReport}
              style={{
                background: "transparent",
                border: "none",
                color: "#0B5394",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Report this
            </button>
          )}
        </Box>
      )}
    </Box>
  );
}
