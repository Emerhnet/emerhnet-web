import Box from "@mui/material/Box";

interface Props {
  size?: number;
  showText?: boolean;
}

export function EmerhnetLogo({ size = 40 }: { size?: number }) {
  // Mark: rounded-square background w/ medical cross + 4 corner network nodes.
  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "block",
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="emn-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="11"
        fill="url(#emn-grad)"
      />
      {/* Network nodes at four inset corners */}
      {[
        { cx: 10, cy: 10 },
        { cx: 38, cy: 10 },
        { cx: 10, cy: 38 },
        { cx: 38, cy: 38 },
      ].map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r="2"
          fill="#E8EEF5"
          opacity="0.55"
        />
      ))}
      {/* Faint connecting lines (network mesh) */}
      <g stroke="#E8EEF5" strokeWidth="0.6" opacity="0.25">
        <line x1="10" y1="10" x2="38" y2="38" />
        <line x1="38" y1="10" x2="10" y2="38" />
      </g>
      {/* Medical cross */}
      <g fill="#E63946">
        <rect x="21" y="13" width="6" height="22" rx="1.5" />
        <rect x="13" y="21" width="22" height="6" rx="1.5" />
      </g>
      {/* Inner highlight ring around cross */}
      <circle
        cx="24"
        cy="24"
        r="13"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
    </Box>
  );
}

export function EmerhnetWordmark({ size = 28, showText = true }: Props) {
  const markSize = Math.round(size * 1.15);
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <EmerhnetLogo size={markSize} />
      {showText && (
        <Box
          component="span"
          sx={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontWeight: 700,
            fontSize: size * 0.7,
            letterSpacing: "0.02em",
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          EMERHNET
        </Box>
      )}
    </Box>
  );
}
