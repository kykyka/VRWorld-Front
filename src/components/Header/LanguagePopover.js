import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";

const languageOptions = {
  en: {
    icon: "/static/icons/uk_flag.svg",
    label: "English",
  },
  ru: {
    icon: "/static/icons/ru_flag.svg",
    label: "Русский",
  },
  de: {
    icon: "/static/icons/de_flag.svg",
    label: "Deutsch",
  },
};

const LanguagePopover = () => {
  const anchorRef = useRef(null);
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language);
    setOpen(false);
  };

  const normalizedLanguage = i18n.language.split("-")[0];
  const selectedOption = languageOptions[normalizedLanguage];

  return (
    <>
      <IconButton onClick={handleOpen} ref={anchorRef}>
        <Box
          sx={{
            display: "flex",
            height: 20,
            width: 20,
            "& img": {
              width: "100%",
            },
          }}
        >
          {selectedOption && (
            <img alt={selectedOption.label} src={selectedOption.icon} />
          )}
        </Box>
      </IconButton>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240, backgroundColor: "background.light" },
        }}
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            onClick={() => handleChangeLanguage(language)}
            key={language}
          >
            <ListItemIcon>
              <Box
                sx={{
                  display: "flex",
                  height: 20,
                  width: 20,
                  "& img": {
                    width: "100%",
                  },
                }}
              >
                <img
                  alt={languageOptions[language].label}
                  src={languageOptions[language].icon}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{ color: "text.secondary" }}
                  variant="subtitle2"
                >
                  {languageOptions[language].label}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

export default LanguagePopover;
