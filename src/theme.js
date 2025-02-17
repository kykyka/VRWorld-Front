import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: ["none"],
  palette: {
    primary: {
      main: "#d6dbe4",
    },
    secondary: {
      main: "#d3bb8a",
    },
    background: {
      default: "#0f1621", // black
    },
    text: {
      primary: "#d6dbe4", // white
      secondary: "#0f1621", // black
      tertiary: "#d3bb8a", // brown
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
});
