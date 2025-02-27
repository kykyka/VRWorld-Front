import { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Drawer, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import LanguagePopover from "./LanguagePopover";

export const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    textTransform: "uppercase",
    color: isActive ? "#d3bb8a" : "#d6dbe4",
    fontSize: "18px",
    fontWeight: 700,
    transition: "color 0.3s",
    margin: "10px 0",
  });

  return (
    <AppBar
      position="sticky"
      sx={{
        borderBottom: scrolled ? "" : "1px solid #47505f",
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.4)" : "background.default",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.3s ease-in-out",
        padding: "10px 20px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Логотип */}
        <Box
          component="img"
          src="/static/imgs/logo.png"
          alt="VR Logo"
          sx={{ width: 75, cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        />
        {/* Навигация для больших экранов */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <NavLink to="/" style={linkStyle} aria-label={t("home")}>
            {t("home")}
          </NavLink>
          <NavLink to="/games" style={linkStyle} aria-label={t("games")}>
            {t("games")}
          </NavLink>
          <NavLink to="/pricing" style={linkStyle} aria-label={t("pricing")}>
            {t("pricing")}
          </NavLink>
          <NavLink to="/booking" style={linkStyle} aria-label={t("book")}>
            {t("book")}
          </NavLink>
          <LanguagePopover />
        </Box>

        {/* Бургер-меню для мобильных экранов */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            onClick={handleDrawerToggle}
            color="primary"
            aria-label="Меню"
          >
            <MenuIcon />
          </IconButton>

          <LanguagePopover />
        </Box>
      </Toolbar>

      {/* Мобильное меню (Drawer) */}
      <Drawer
        anchor="top"
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          transition: "transform 0.3s ease", // Плавное открытие/закрытие
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "20px",
            backgroundColor: "#121212",
            width: "100%",
            height: "100vh",
          }}
        >
          {/* Кнопка закрытия */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "absolute",
              top: "10px",
              right: "20px",
              color: "#fff",
            }}
            aria-label="Закрыть меню"
          >
            <CloseIcon />
          </IconButton>

          {/* Навигационные ссылки */}
          <NavLink
            to="/"
            style={linkStyle}
            onClick={handleDrawerToggle}
            aria-label={t("home")}
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/games"
            style={linkStyle}
            onClick={handleDrawerToggle}
            aaria-label={t("games")}
          >
            {t("games")}
          </NavLink>
          <NavLink
            to="/pricing"
            style={linkStyle}
            onClick={handleDrawerToggle}
            aria-label={t("pricing")}
          >
            {t("pricing")}
          </NavLink>
          <NavLink
            to="/booking"
            style={linkStyle}
            onClick={handleDrawerToggle}
            aaria-label={t("book")}
          >
            {t("book")}
          </NavLink>
        </Box>
      </Drawer>
    </AppBar>
  );
};
