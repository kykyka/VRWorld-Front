import { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Drawer, IconButton } from "@mui/material";
import { NavLink as RouterNavLink } from "react-router-dom";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import LanguagePopover from "./LanguagePopover";

// Кастомный NavLink с ховер-эффектом и подсветкой активной ссылки
const StyledNavLinkBase = styled("a")(({ isActive }) => ({
  textDecoration: "none",
  textTransform: "uppercase",
  color: isActive ? "#d3bb8a" : "#d6dbe4", // Подсветка активной ссылки
  fontSize: "18px",
  fontWeight: 700,
  margin: "10px 0",
  position: "relative",
  display: "inline-block",
  overflow: "hidden",
  "& > span": {
    display: "inline-block",
    transition: isActive ? "none" : "transform 0.3s ease-in-out", // Отключаем ховер для активной
  },
  "&:hover > span": {
    transform: isActive ? "none" : "translateY(100%)", // Ховер только для неактивных
  },
  "&:before": {
    content: "attr(data-text)",
    position: "absolute",
    top: "-100%", // Изначально сверху
    left: 0,
    width: "100%",
    height: "100%",
    color: "#d3bb8a", // Коричневый цвет для ховер-эффекта
    transition: isActive ? "none" : "top 0.3s ease-in-out", // Отключаем ховер для активной
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "&:hover:before": {
    top: isActive ? "-100%" : 0, // Ховер не применяется для активной ссылки
  },
}));

// Обертка для передачи isActive из NavLink
const StyledNavLink = ({ to, children, ...props }) => (
  <RouterNavLink
    to={to}
    style={({ isActive }) => ({ display: "inline-block" })}
  >
    {({ isActive }) => (
      <StyledNavLinkBase isActive={isActive} data-text={children} {...props}>
        <span>{children}</span>
      </StyledNavLinkBase>
    )}
  </RouterNavLink>
);

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
          <StyledNavLink to="/" aria-label={t("home")}>
            {t("home")}
          </StyledNavLink>
          <StyledNavLink to="/games" aria-label={t("games")}>
            {t("games")}
          </StyledNavLink>
          <StyledNavLink to="/pricing" aria-label={t("pricing")}>
            {t("pricing")}
          </StyledNavLink>
          <StyledNavLink to="/booking" aria-label={t("book")}>
            {t("book")}
          </StyledNavLink>
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
          transition: "transform 0.3s ease",
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

          <StyledNavLink
            to="/"
            onClick={handleDrawerToggle}
            aria-label={t("home")}
          >
            {t("home")}
          </StyledNavLink>
          <StyledNavLink
            to="/games"
            onClick={handleDrawerToggle}
            aria-label={t("games")}
          >
            {t("games")}
          </StyledNavLink>
          <StyledNavLink
            to="/pricing"
            onClick={handleDrawerToggle}
            aria-label={t("pricing")}
          >
            {t("pricing")}
          </StyledNavLink>
          <StyledNavLink
            to="/booking"
            onClick={handleDrawerToggle}
            aria-label={t("book")}
          >
            {t("book")}
          </StyledNavLink>
        </Box>
      </Drawer>
    </AppBar>
  );
};
