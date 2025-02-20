import React from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

export const Footer = () => {
  const { t } = useTranslation();

  const linkStyle = {
    textDecoration: "none",
    color: "#d6dbe4",
    fontSize: "16px",
    transition: "color 0.3s",
    "&:hover": { color: "#d3bb8a" },
  };

  const socialMediaStyle = {
    color: "#d6dbe4",
    "&:hover": { color: "#d3bb8a", transform: "scale(1.2)" },
    transition: "transform 0.3s ease",
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        padding: "40px 40px",
        textAlign: "left",
      }}
    >
      <Grid container spacing={4} justifyContent="start">
        {/* Навигация */}
        <Grid item xs={12} md={2} sx={{ paddingBottom: { xs: 3, md: 0 } }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "10px", color: "#47505f" }}
          >
            {t("quick_links")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link component={NavLink} to="/" sx={{ ...linkStyle }}>
              <Typography>{t("home")}</Typography>
            </Link>
            <Link component={NavLink} to="/games" sx={{ ...linkStyle }}>
              <Typography>{t("games")}</Typography>
            </Link>
            <Link component={NavLink} to="/pricing" sx={{ ...linkStyle }}>
              <Typography>{t("pricing")}</Typography>
            </Link>
            <Link component={NavLink} to="/booking" sx={{ ...linkStyle }}>
              <Typography>{t("book")}</Typography>
            </Link>
          </Box>
        </Grid>

        {/* График работы */}
        <Grid item xs={12} md={3} sx={{ paddingBottom: { xs: 3, md: 0 } }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "10px", color: "#47505f" }}
          >
            {t("working_hours")}
          </Typography>
          <Box>
            <Typography>🕒 {t("mon_fri")}: 10:00 - 22:00</Typography>
            <Typography>🕒 {t("sat_sun")}: 12:00 - 23:00</Typography>
          </Box>
        </Grid>

        {/* Адрес + Контакты */}
        <Grid item xs={12} md={3} sx={{ paddingBottom: { xs: 3, md: 0 } }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "10px", color: "#47505f" }}
          >
            {t("our_address")}
          </Typography>
          <Typography>{t("address_line1")}</Typography>
          <Typography>{t("address_line2")}</Typography>
          <Box sx={{ marginTop: "10px" }}>
            <Link href="mailto:info@emperiavr.com" sx={{ ...linkStyle }}>
              <Typography>info@emperiavr.com</Typography>
            </Link>
            <Link href="tel:+1234567890" sx={{ ...linkStyle }}>
              <Typography>+1 234 567 890</Typography>
            </Link>
          </Box>
        </Grid>

        {/* Google Карта + Соцсети */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "10px", color: "#47505f" }}
          >
            {t("find_us")}
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              height: "250px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.9169090540647!2d13.388859315807178!3d52.517036179810225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851b63f7304d1%3A0x4212df3df1e8f504!2sBerlin%20VR%20Arena!5e0!3m2!1sen!2sde!4v1633021184003!5m2!1sen!2sde"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Box>

          {/* Социальные сети */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: "10px",
              // justifyContent: "center",
            }}
          >
            <IconButton
              href="https://www.instagram.com/VRWorld"
              target="_blank"
              sx={socialMediaStyle}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://www.facebook.com/VRWorld"
              target="_blank"
              sx={socialMediaStyle}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.youtube.com/VRWorld"
              target="_blank"
              sx={socialMediaStyle}
            >
              <YouTubeIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Typography
        variant="body2"
        sx={{ marginTop: "20px", opacity: 0.6, textAlign: "center" }}
      >
        &copy; {new Date().getFullYear()} VRWorld. {t("all_rights_reserved")}
      </Typography>
    </Box>
  );
};
