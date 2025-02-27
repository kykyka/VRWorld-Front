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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Дефолтные стили для кнопок
          backgroundColor: "#d6dbe4", // Светлый фон (из palette.primary.main)
          color: "#0f1621", // Темный текст (из palette.text.secondary)
          position: "relative",
          overflow: "hidden",
          padding: "8px 16px", // Добавляем отступы для единообразия
          "& > span": {
            display: "inline-block",
            transition: "transform 0.3s ease-in-out",
            position: "relative",
            zIndex: 1,
          },
          "&:hover > span": {
            transform: "translateY(120%)", // Текст уезжает вниз при ховере
          },
          "&:before": {
            content: "attr(data-text)", // Текст из атрибута data-text
            position: "absolute",
            top: "-100%", // Изначально сверху
            left: 0,
            width: "100%",
            height: "100%",
            color: "#0f1621", // Темный текст для ховер-эффекта
            backgroundColor: "#d3bb8a", // Коричневый фон при ховере
            transition: "top 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          },
          "&:hover": {
            backgroundColor: "#d3bb8a", // Коричневый фон при ховере
          },
          "&:hover:before": {
            top: 0, // Текст опускается сверху при ховере
          },
        },
      },
      defaultProps: {
        disableElevation: true, // Убираем тень по умолчанию
      },
    },
  },
});
