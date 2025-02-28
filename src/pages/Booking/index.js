import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import MainButton from "../../components/Buttons/MainButton";
import { green } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "dayjs/locale/de";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import dayjs from "dayjs";
import GradientCircularProgress from "../../components/Loaders/GradientCircularProgress";

export const Booking = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [bookIsLoading, setBookIsLoading] = useState(false);
  const [success, setSuccess] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [availableHours, setAvailableHours] = useState({});
  const [price, setPrice] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    description: "",
    email: "",
  });

  // Прокрутка к началу страницы при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentLang = localStorage.getItem("i18nextLng") || "de";

  useEffect(() => {
    dayjs.locale(currentLang);
  }, [currentLang]);

  const timeSlots = Array.from(
    { length: availableHours.to - availableHours.from },
    (_, i) => availableHours.from + i
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dateStr = selectedDate.format("YYYY-MM-DD");
        const baseURL =
          process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseURL}/day/${dateStr}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setAvailableHours(result.data.available_hours || { from: 12, to: 20 });
        setPrice(result.data.price);
        setBookings(result.data.devices || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data, using mock data:", error);
        const mockResponse = {
          data: {
            price: 40,
            available_hours: { from: 10, to: 20 },
            devices: [
              { id: 1, name: "Mock VR Device 1", reservations: [19] },
              { id: 2, name: "Mock VR Device 2", reservations: [19] },
              { id: 3, name: "Mock VR Device 3", reservations: [19] },
              { id: 4, name: "Mock VR Device 4", reservations: [19] },
            ],
          },
        };
        setAvailableHours(mockResponse.data.available_hours);
        setBookings(mockResponse.data.devices);
        setPrice(mockResponse.data.price);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const isTimeSlotBooked = (deviceId, hour) => {
    const device = bookings.find((d) => d.id === deviceId);
    return device ? device.reservations.includes(hour) : false;
  };

  const handleTimeSlotToggle = (deviceId, hour) => {
    setSelectedTimes((prev) => {
      const currentSelections = prev[deviceId] || [];
      const isSelected = currentSelections.includes(hour);
      if (isSelected) {
        return {
          ...prev,
          [deviceId]: currentSelections.filter((h) => h !== hour),
        };
      } else {
        return {
          ...prev,
          [deviceId]: [...currentSelections, hour],
        };
      }
    });
  };

  const handleBooking = async () => {
    if (!bookIsLoading) {
      setSuccess(false);
      setBookIsLoading(true);
    }

    if (Object.values(selectedTimes).every((hours) => hours.length === 0)) {
      alert(t("pleaseSelectTimeSlots"));
      setBookIsLoading(false);
      return;
    }
    if (!userDetails.name.trim()) {
      alert(t("nameRequired"));
      setBookIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      alert(t("invalidEmail"));
      setBookIsLoading(false);
      return;
    }

    const bookingData = {
      date: selectedDate.format("YYYY-MM-DD"),
      name: userDetails.name,
      description: userDetails.description,
      email: userDetails.email,
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
        // Обновляем состояние bookings, добавляя выбранные слоты в reservations
        setBookings((prevBookings) =>
          prevBookings.map((device) => {
            const selectedHours = selectedTimes[device.id] || [];
            if (selectedHours.length > 0) {
              return {
                ...device,
                reservations: [...device.reservations, ...selectedHours],
              };
            }
            return device;
          })
        );
        setSelectedTimes({});
        setUserDetails({ name: "", description: "", email: "" });
        setSuccess(true);
      }
      setBookIsLoading(false);
    } catch (error) {
      console.error("Booking error:", error);
      setBookIsLoading(false);
      alert(t("bookingError"));
    }
  };

  const buttonSx = {
    mt: 4,
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {t("bookYourSlot")}
          </Typography>
          <Typography variant="subtitle1">{t("locationName")}</Typography>
        </Box>
        {price && (
          <Typography
            variant="h6"
            sx={{
              color: "#d3bb8a",
              fontWeight: "bold",
            }}
          >
            {price} EUR / {t("hour")}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={currentLang}
        >
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            format={"DD.MM.YYYY"}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "background.light",
                      color: "text.secondary",
                      borderRadius: 1,
                      height: "40px",
                    },
                    "& .MuiInputBase-input": {
                      color: "text.secondary",
                      py: 1,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.secondary",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.tertiary",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d3bb8a",
                    },
                  }}
                />
              ),
            }}
            slotProps={{
              popper: {
                sx: {
                  "& .MuiPaper-root": {
                    backgroundColor: "background.default",
                    color: "text.primary",
                    border: "1px solid",
                    borderColor: "text.tertiary",
                  },
                  "& .MuiPickersDay-root": {
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#d3bb8a",
                    color: "#0f1621",
                    "&:hover": {
                      backgroundColor: "#b89f6e",
                    },
                  },
                  "& .MuiPickersDay-root.Mui-disabled": {
                    color: "grey !important",
                  },
                  "& .MuiPickersCalendarHeader-label": {
                    color: "text.primary",
                  },
                  "& .MuiIconButton-root": {
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                },
              },
            }}
            minDate={dayjs()}
          />
        </LocalizationProvider>
        <IconButton
          onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}
          disabled={selectedDate.isSame(dayjs(), "day")}
          sx={{
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "text.tertiary",
            },
            "&.Mui-disabled": {
              color: "rgba(255, 255, 255, 0.3)",
            },
            "& .MuiSvgIcon-root": {
              transform: "translateX(4px)",
            },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={() => setSelectedDate(selectedDate.add(1, "day"))}
          sx={{
            color: "text.primary",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "text.tertiary",
            },
            "& .MuiSvgIcon-root": {
              transform: "translateX(1px)",
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            width: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: "330px",
            py: 10,
          }}
        >
          <GradientCircularProgress size={48} />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {bookings.map((device) => (
                <Grid item xs={12} md={3} key={device.id}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {device.name}
                  </Typography>
                  {timeSlots.map((hour) => {
                    const isBooked = isTimeSlotBooked(device.id, hour);
                    const isSelected = (
                      selectedTimes[device.id] || []
                    ).includes(hour);

                    return (
                      <Button
                        key={hour}
                        variant="outlined"
                        disabled={isBooked}
                        onClick={() => handleTimeSlotToggle(device.id, hour)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          width: "80px",
                          backgroundColor: isBooked
                            ? "rgba(255, 99, 71, 0.2)"
                            : isSelected
                            ? "#d3bb8a"
                            : "rgba(255, 255, 255, 0.1)",
                          color: isSelected
                            ? "#0f1621"
                            : isBooked
                            ? "text.primary"
                            : "text.primary",
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
                            backgroundColor: "rgba(255, 99, 71, 0.2)", // Сохраняем красный фон
                            color: "text.primary", // Сохраняем цвет текста
                            opacity: 1, // Убираем затемнение (по умолчанию opacity уменьшается)
                            borderColor: "rgba(255, 99, 71, 0.5)", // Сохраняем обводку
                          }, // Отключаем нажатие на забронированные слоты
                        }}
                      >
                        {hour}:00
                      </Button>
                    );
                  })}
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "500px" }}>
              <TextField
                fullWidth
                required
                placeholder={t("fullName")}
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                sx={{
                  mb: 2,
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
                }}
              />
              <TextField
                fullWidth
                placeholder={t("email")}
                value={userDetails.email}
                onChange={(e) => {
                  setUserDetails({
                    ...userDetails,
                    email: e.target.value,
                  });
                }}
                sx={{
                  mb: 2,
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
                }}
              />
              <TextField
                fullWidth
                rows={3}
                placeholder={t("bookingDescription")}
                value={userDetails.description}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    description: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
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
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "primary",
                  fontSize: "0.8rem",
                  mb: 2,
                  width: "100%",
                  maxWidth: "500px",
                  textAlign: "left",
                }}
              >
                {t("notesDescription")}
              </Typography>
            </Box>

            {Object.keys(selectedTimes).length > 0 && (
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
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {t("yourBooking")}
                </Typography>
                {Object.entries(selectedTimes).map(([deviceId, hours]) =>
                  hours.map((hour, index) => (
                    <Typography
                      key={`${deviceId}-${hour}`}
                      sx={{ fontSize: "0.9rem", mb: 0.5 }}
                    >
                      {dayjs(selectedDate).format("DD.MM.YYYY")} {hour}:00-
                      {hour + 1}:00 –{" "}
                      {bookings.find((d) => d.id === parseInt(deviceId))?.name}
                    </Typography>
                  ))
                )}
                <Typography sx={{ fontSize: "0.9rem" }}>
                  {t("estimatedPrice")}:{" "}
                  {price * Object.values(selectedTimes).flat().length},-
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: 1,
              display: "flex",
              justifyContent: "center",
              position: "relative",
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
                  marginTop: "2px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
