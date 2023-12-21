import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#771F98", // Your primary color
      light: "#9e4bb5", // Lighter shade of primary color
      dark: "#5b146a", // Darker shade of primary color
      contrastText: "#ffffff", // Text color that contrasts with primary color
    },
    secondary: {
      main: "#993F3F", // Your secondary color
      light: "#b36969", // Lighter shade of secondary color
      dark: "#6e2828", // Darker shade of secondary color
      contrastText: "#ffffff", // Text color that contrasts with secondary color
    },
    error: {
      main: "#f44336", // Standard error color (red)
    },
    warning: {
      main: "#ff9800", // Standard warning color (orange)
    },
    info: {
      main: "#2196f3", // Standard info color (blue)
    },
    success: {
      main: "#4caf50", // Standard success color (green)
    },
    // Adding a custom color
    customBlack: {
      main: "#000000", // your black color
      grey: "#edf2f4",
      white: "#ffffff",
    },
  },
  typography: {
    h5: {
      fontSize: 24,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
    },
    body2: {
      fontSize: 16,
      fontWeight: 600,
    },
    fontFamily: "Poppins, sans-serif",
  },
});

export default theme;
