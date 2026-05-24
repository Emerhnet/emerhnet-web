import Typography from "@mui/material/Typography";

export function EmerhnetWordmark({ size = 28 }: { size?: number }) {
  return (
    <Typography
      component="div"
      sx={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.02em",
        color: "primary.main",
        lineHeight: 1,
      }}
    >
      EMERHNET
    </Typography>
  );
}
