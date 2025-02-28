import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MainButton from "../../components/Buttons/MainButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useTranslation } from "react-i18next";
import "dayjs/locale/de";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import dayjs from "dayjs";

const OutboundBooking = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [price, setPrice] = useState(50);
  const [availableHours] = useState({ from: 10, to: 20 }); // Можно сделать динамическим
  const [bookings, setBookings] = useState([]); // Здесь будут храниться занятые слоты
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    description: "",
    insideOutside: "inside",
    devicesCount: "",
    address: "",
  });

  const currentLang = localStorage.getItem("i18nextLng") || "de";
  useEffect(() => {
    dayjs.locale(currentLang);
  }, [currentLang]);

  const timeSlots = Array.from(
    { length: availableHours.to - availableHours.from },
    (_, i) => availableHours.from + i
  );

  // Логика определения занятых слотов (включая соседние)
  const isTimeSlotBooked = (hour) => {
    return bookings.some(
      (reservedHour) =>
        reservedHour === hour ||
        reservedHour === hour - 1 ||
        reservedHour === hour + 1
    );
  };

  const handleTimeSlotToggle = (hour) => {
    setSelectedTimes((prev) => {
      const isSelected = prev.includes(hour);
      if (isSelected) {
        return prev.filter((h) => h !== hour);
      } else {
        return [...prev, hour].sort((a, b) => a - b);
      }
    });
  };

  const handleFormChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.fullname) {
      alert(t("fullnameRequired"));
      return;
    }
    if (!formData.email && !formData.phone) {
      alert(t("emailOrPhoneRequired"));
      return;
    }
    if (selectedTimes.length === 0) {
      alert(t("pleaseSelectTimeSlots"));
      return;
    }

    const bookingData = {
      ...formData,
      date: selectedDate.format("YYYY-MM-DD"),
      timeSlots: selectedTimes,
    };

    console.log("Booking data:", bookingData);
    // Здесь можно добавить отправку данных на сервер

    setBookings([...bookings, ...selectedTimes]);
    setSelectedTimes([]);
    setFormData({
      fullname: "",
      email: "",
      phone: "",
      description: "",
      insideOutside: "inside",
      devicesCount: "",
      address: "",
    });
    setOpen(false);
  };

  const fieldStyle = {
    mb: 3,
    "& .MuiInputBase-root": {
      backgroundColor: "background.light",
      color: "text.secondary",
      borderRadius: 1,
    },
    "& .MuiInputBase-input": {
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "text.secondary",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "text.tertiary",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d3bb8a", // Коричневый бордер при ховере
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d3bb8a", // Коричневый бордер при фокусе
    },
  };

  return (
    <>
      <MainButton onClick={() => setOpen(true)}>{t("bookOutbound")}</MainButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.default",
            color: "text.primary",
            p: 4,
            border: "1px solid #d3bb8a",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Левая часть - Календарь и слоты */}
            <Box sx={{ width: "50%" }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={currentLang}
              >
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  minDate={dayjs()}
                  sx={{
                    m: 0,
                    "& .MuiPickersCalendarHeader-label": {
                      color: "text.primary",
                    },
                    "& .MuiPickersDay-root.Mui-disabled": {
                      color: "grey !important",
                    },
                    "& .MuiIconButton-root": {
                      color: "text.primary",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                    "& .MuiPickersDay-root": {
                      color: "text.primary",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      "&.Mui-selected": {
                        bgcolor: "#d3bb8a",
                        color: "#0f1621",
                        "&:hover": { bgcolor: "#b89f6e" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <Box sx={{ mb: 1 }}>
                {timeSlots.map((hour) => {
                  const isBooked = isTimeSlotBooked(hour);
                  const isSelected = selectedTimes.includes(hour);
                  return (
                    <Button
                      key={hour}
                      variant="outlined"
                      disabled={isBooked}
                      onClick={() => handleTimeSlotToggle(hour)}
                      sx={{
                        mr: 1,
                        mb: 1,
                        width: "80px",
                        backgroundColor: isBooked
                          ? "rgba(255, 99, 71, 0.2)"
                          : isSelected
                          ? "#d3bb8a"
                          : "rgba(255, 255, 255, 0.1)",
                        color: isSelected ? "#0f1621" : "text.primary",
                        borderColor: isBooked
                          ? "rgba(255, 99, 71, 0.5)"
                          : "text.secondary",
                        "&:hover": {
                          backgroundColor: isBooked
                            ? "rgba(255, 99, 71, 0.3)"
                            : isSelected
                            ? "#b89f6e"
                            : "background.default",
                          borderColor: isSelected
                            ? "#b89f6e"
                            : "rgba(255, 255, 255, 0.1)",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(255, 99, 71, 0.2)",
                          color: "text.primary",
                          opacity: 1,
                          borderColor: "rgba(255, 99, 71, 0.5)",
                        },
                      }}
                    >
                      {hour}:00
                    </Button>
                  );
                })}
              </Box>
              <Typography sx={{ mb: 4, color: "text.primary" }}>
                {t("pricePerHour")}: {price} EUR
              </Typography>
              {selectedTimes.length > 0 && (
                <Box
                  sx={{
                    p: 2,
                    boxSizing: "border-box",
                    backgroundColor: "#d3bb8a",
                    color: "#0f1621",
                    borderRadius: 2,
                    width: "100%",
                    maxWidth: "500px",
                  }}
                >
                  <Typography>
                    {t("estimatedPrice")}: {price * selectedTimes.length} EUR
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Правая часть - Форма */}
            <Box sx={{ width: "50%" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("bookingDetails")}
              </Typography>

              <TextField
                fullWidth
                required
                placeholder={t("fullName")}
                value={formData.fullname}
                onChange={handleFormChange("fullname")}
                sx={fieldStyle}
              />
              <TextField
                fullWidth
                placeholder={t("email")}
                value={formData.email}
                onChange={handleFormChange("email")}
                sx={fieldStyle}
              />
              <TextField
                fullWidth
                placeholder={t("phone")}
                value={formData.phone}
                onChange={handleFormChange("phone")}
                sx={fieldStyle}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder={t("description")}
                value={formData.description}
                onChange={handleFormChange("description")}
                sx={fieldStyle}
              />
              <FormControl fullWidth>
                <Select
                  sx={{
                    backgroundColor: "background.light",
                    color: "text.secondary",
                    borderRadius: 1,
                    mb: 3,
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "background.light",
                        "& .MuiMenuItem-root": {
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&.Mui-selected": {
                            bgcolor: "#d3bb8a",
                            color: "#0f1621",
                            "&:hover": {
                              bgcolor: "#b89f6e",
                            },
                          },
                        },
                      },
                    },
                  }}
                  placeholder={t("insideOutside")}
                  value={formData.insideOutside}
                  onChange={handleFormChange("insideOutside")}
                >
                  <MenuItem value="inside">{t("inside")}</MenuItem>
                  <MenuItem value="outside">{t("outside")}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                placeholder={t("devicesCount")}
                value={formData.devicesCount}
                onChange={handleFormChange("devicesCount")}
                sx={fieldStyle}
              />
              <TextField
                fullWidth
                placeholder={t("address")}
                value={formData.address}
                onChange={handleFormChange("address")}
                sx={fieldStyle}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", w: 1, justifyContent: "center" }}>
            <MainButton onClick={handleSubmit} sx={{ mt: 2 }}>
              {t("confirmBooking")}
            </MainButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default OutboundBooking;
