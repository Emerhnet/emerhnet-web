import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tint: {
      primary: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
    surface: {
      default: string;
      alt: string;
      border: string;
    };
  }
  interface PaletteOptions {
    tint?: Palette["tint"];
    surface?: Palette["surface"];
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B2545",
      light: "#1E3A5F",
      contrastText: "#FFFFFF",
    },
    success: { main: "#0F5132", contrastText: "#FFFFFF" },
    warning: { main: "#8B5A00", contrastText: "#FFFFFF" },
    error: { main: "#842029", contrastText: "#FFFFFF" },
    info: { main: "#0B5394", contrastText: "#FFFFFF" },
    background: {
      default: "#FAF7F2",
      paper: "#FFFFFF",
    },
    divider: "#DCD7CD",
    tint: {
      primary: "#E8EEF5",
      success: "#D1E7DD",
      warning: "#FFF3CD",
      danger: "#F8D7DA",
      info: "#CFE2FF",
    },
    surface: {
      default: "#FAF7F2",
      alt: "#F2EEE6",
      border: "#DCD7CD",
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontSize: "28px", fontWeight: 600, lineHeight: 1.25 },
    h2: { fontSize: "20px", fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: "16px", fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "14px", lineHeight: 1.5 },
    body2: { fontSize: "14px", lineHeight: 1.5 },
    caption: { fontSize: "12px", lineHeight: 1.4 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8, border: "1px solid #DCD7CD" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true },
    },
  },
});
