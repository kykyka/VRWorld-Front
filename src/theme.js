import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: Array(25).fill("none"),
  palette: {
    primary: {
      main: "#d6dbe4", // white
    },
    secondary: {
      main: "#d3bb8a", // brown
    },
    background: {
      default: "#0f1621", // black
      light: "#d6dbe4", // light
    },
    text: {
      primary: "#d6dbe4", // white
      secondary: "#0f1621", // black
      tertiary: "#d3bb8a", // brown
    },
  },
  typography: {
    button: {
      textTransform: "uppercase",
      fontWeight: 500,
    },
    fontFamily: "Work Sans",
  },
});
