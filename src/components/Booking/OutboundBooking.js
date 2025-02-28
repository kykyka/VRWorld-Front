import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { green } from "@mui/material/colors";
import GradientCircularProgress from "../../components/Loaders/GradientCircularProgress";
import MainButton from "../../components/Buttons/MainButton";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useTranslation } from "react-i18next";
import "dayjs/locale/de";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import dayjs from "dayjs";

const OutboundBooking = ({ initData }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookIsLoading, setBookIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [price] = useState(50);
  const [availableHours, setAvailableHours] = useState({});
  const [bookings, setBookings] = useState([]);
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

  useEffect(() => {
    if (!open) return;

    const initializeData = async () => {
      setLoading(true);
      if (initData && selectedDate.isSame(dayjs(), "day")) {
        setAvailableHours(initData.availableHours || { from: 12, to: 20 });
        setBookings(initData.bookings || []);
        setLoading(false);
      } else {
        setSelectedTimes([]);
        await fetchData();
      }
    };

    initializeData();
  }, [open, selectedDate, initData]);

  const fetchData = async () => {
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseURL}/day/${dateStr}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setAvailableHours(result.data.available_hours || { from: 12, to: 20 });
      setBookings(result.data.devices || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data, using mock data:", error);
      const mockResponse = {
        data: {
          available_hours: { from: 10, to: 20 },
          devices: [
            { id: 1, name: "Mock VR Device 1", reservations: [19] },
            { id: 2, name: "Mock VR Device 2", reservations: [10] },
            { id: 3, name: "Mock VR Device 3", reservations: [19] },
            { id: 4, name: "Mock VR Device 4", reservations: [19] },
          ],
        },
      };
      setAvailableHours(mockResponse.data.available_hours);
      setBookings(mockResponse.data.devices);
      setLoading(false);
    }
  };

  const isTimeSlotBooked = (hour) => {
    return bookings.some((device) =>
      device.reservations.some(
        (reservedHour) =>
          reservedHour === hour ||
          reservedHour === hour - 1 ||
          reservedHour === hour + 1
      )
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

  const handleBooking = async () => {
    if (!bookIsLoading) {
      setSuccess(false);
      setBookIsLoading(true);
    }

    if (!formData.fullname) {
      alert(t("fullnameRequired"));
      setBookIsLoading(false);
      return;
    }

    if (!formData.email && !formData.phone) {
      alert(t("emailOrPhoneRequired"));
      setBookIsLoading(false);
      return;
    }

    if (selectedTimes.length === 0) {
      alert(t("pleaseSelectTimeSlots"));
      setBookIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert(t("invalidEmail"));
      setBookIsLoading(false);
      return;
    }

    const bookingData = {
      ...formData,
      date: selectedDate.format("YYYY-MM-DD"),
      reservations: selectedTimes,
    };

    try {
      const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseURL}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        setBookIsLoading(false);
        throw new Error("Booking failed");
      }

      const result = await response.json();
      if (result.success) {
        setBookings((prevBookings) => {
          const updatedBookings = [...prevBookings];
          if (updatedBookings.length > 0) {
            updatedBookings[0].reservations = [
              ...updatedBookings[0].reservations,
              ...selectedTimes,
            ];
          } else {
            updatedBookings.push({
              id: Date.now(),
              name: "Outbound Device",
              reservations: [...selectedTimes],
            });
          }
          return updatedBookings;
        });
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
        setSuccess(true);
        setBookIsLoading(false);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookIsLoading(false);
      alert(t("bookingError"));
    }
  };

  const fieldStyle = {
    mb: { xs: 2, md: 3 },
    "& .MuiInputBase-root": {
      backgroundColor: "background.light",
      color: "text.secondary",
      borderRadius: 1,
      fontSize: { xs: "0.9rem", md: "1rem" },
    },
    "& .MuiInputBase-input": {
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "text.secondary",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d3bb8a",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d3bb8a",
    },
  };

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
    width: { xs: "100%", md: "auto" },
    fontSize: { xs: "0.9rem", md: "1rem" },
    py: 1,
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
            width: { xs: "90%", sm: "80%", md: 800 },
            maxHeight: "95vh",
            overflowY: "auto",
            bgcolor: "background.default",
            color: "text.primary",
            p: { xs: 2, md: 4 },
            border: "1px solid #d3bb8a",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: { xs: 4, md: 8 },
              right: { xs: 4, md: 8 },
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, md: 2 },
            }}
          >
            {/* Левая часть - Календарь и слоты */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
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
                      fontSize: { xs: "1rem", md: "1.25rem" },
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
                      fontSize: { xs: "0.9rem", md: "1rem" },
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

              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    width: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "160px",
                  }}
                >
                  <GradientCircularProgress size={48} />
                </Box>
              ) : (
                <Box sx={{ mb: { xs: 1, md: 1 } }}>
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
                          mr: { xs: 0.5, md: 1 },
                          mb: 1,
                          width: { xs: "70px", md: "80px" },
                          fontSize: { xs: "0.8rem", md: "1rem" },
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
                            borderColor: isBooked
                              ? "rgba(255, 99, 71, 0.5)"
                              : isSelected
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
              )}
              <Typography
                sx={{
                  mb: { xs: 2, md: "27px" },
                  color: "text.primary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                {t("outboundPricePerHour")}: {price} EUR
              </Typography>
              {selectedTimes.length > 0 && (
                <Box
                  sx={{
                    p: { xs: 1, md: 2 },
                    boxSizing: "border-box",
                    backgroundColor: "#d3bb8a",
                    color: "#0f1621",
                    borderRadius: 2,
                    width: "100%",
                    maxWidth: { xs: "100%", md: "500px" },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    {t("estimatedPrice")}: {price * selectedTimes.length} EUR
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Правая часть - Форма */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                {t("outboundBookingDetails")}
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
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "background.light",
                        "& .MuiMenuItem-root": {
                          color: "text.secondary",
                          fontSize: { xs: "0.9rem", md: "1rem" },
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              mt: { xs: 2, md: 0 },
            }}
          >
            <MainButton
              sx={buttonSx}
              onClick={handleBooking}
              disabled={bookIsLoading}
            >
              {success ? t("bookingSuccess") : t("confirmBooking")}
            </MainButton>
            {bookIsLoading && (
              <GradientCircularProgress
                size={24}
                progressSx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default OutboundBooking;
