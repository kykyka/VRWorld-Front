import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        color: "#fff",
        textAlign: "left",
        overflow: "hidden",
        background:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
      }}
    >
      {/* Встроенное видео с YouTube */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/z0Ipt1UOBOs?autoplay=1&mute=1&loop=1&playlist=z0Ipt1UOBOs&controls=0&showinfo=0&rel=0&playsinline=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Контент */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          color="primary"
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "6rem" },
            fontWeight: 700,
            fontFamily: "Michroma",
            mb: 2,
            textTransform: "uppercase",
          }}
        >
          {t("homeTitle")}
        </Typography>
        <Typography
          color="primary"
          variant="h5"
          sx={{
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            mb: 5,
            opacity: 0.8,
            fontFamily: "Michroma",
          }}
        >
          {t("homeSubtitle")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            backgroundColor: "#d3bb8a",
            "&:hover": { backgroundColor: "#b89f6e" },
          }}
        >
          {t("homeButtonBook")}
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
