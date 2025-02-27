import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
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

export const Booking = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({}); // Объект для хранения выбранных интервалов по ID устройств
  const [availableHours, setAvailableHours] = useState({});
  const [userDetails, setUserDetails] = useState({
    name: "",
    description: "",
    email: "",
  });

  const currentLang = localStorage.getItem("i18nextLng") || "de"; // По умолчанию английский

  // Устанавливаем локаль для dayjs
  useEffect(() => {
    dayjs.locale(currentLang); // Устанавливаем локаль для корректного форматирования дат
  }, [currentLang]);

  // Генерация timeSlots на основе availableHours
  const timeSlots = Array.from(
    { length: availableHours.to - availableHours.from },
    (_, i) => availableHours.from + i
  );

  // Получение данных с API или использование mock данных при ошибке
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
        setBookings(result.data.devices || []);
      } catch (error) {
        console.error("Error fetching data, using mock data:", error);
        // Mock данные при ошибке
        const mockResponse = {
          data: {
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
      }
    };
    fetchData();
  }, [selectedDate]);

  // Проверка занятости слота для конкретного устройства
  const isTimeSlotBooked = (deviceId, hour) => {
    const device = bookings.find((d) => d.id == deviceId);
    return device ? device.reservations.includes(hour) : false;
  };

  // Обработка выбора/снятия выбора интервала
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

  // Обработка бронирования с проверкой обязательного поля name
  const handleBooking = async () => {
    if (Object.values(selectedTimes).every((hours) => hours.length === 0)) {
      alert(t("pleaseSelectTimeSlots"));
      return;
    }
    if (!userDetails.name.trim()) {
      alert(t("nameRequired"));
      return;
    }

    const bookingData = {
      date: selectedDate.format("YYYY-MM-DD"),
      name: userDetails.name,
      description: userDetails.description,
      email: userDetails.email, // Добавляем количество игроков
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
        throw new Error("Booking failed");
      }

      alert(t("bookingSuccess"));
      const result = await response.json();
      setBookings(result.data.devices || bookings);
      setSelectedTimes({});
      setUserDetails({ name: "", description: "", email: "" }); // Сбрасываем с начальным значением для email
    } catch (error) {
      console.error("Booking error:", error);
      alert(t("bookingError"));
    }
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
        <Typography
          variant="h6"
          sx={{
            color: "#d3bb8a", // Цвет акцента из темы
            fontWeight: "bold",
          }}
        >
          40 EUR / {t("hour")}
        </Typography>
      </Box>

      {/* Датапикер с локализацией и стилями */}
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
                    borderColor: "text.secondary",
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
                    color: "grey !important", // Серый цвет для недоступных дат
                  },
                  "& .MuiPickersCalendarHeader-label": {
                    color: "text.primary",
                  },
                  "& .MuiIconButton-root": {
                    // Стили для стрелок переключения месяцев
                    color: "text.primary", // Светлый цвет стрелок
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                },
              },
            }}
            renderInput={(params) => <TextField {...params} />}
            minDate={dayjs()} // Ограничение минимальной даты на сегодняLocalizationProvider
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
            // Корректировка смещения для ArrowBackIosIcon
            "& .MuiSvgIcon-root": {
              transform: "translateX(4px)", // Смещаем вправо, чтобы выровнять по центру
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
            // Корректировка смещения для ArrowForwardIosIcon
            "& .MuiSvgIcon-root": {
              transform: "translateX(1px)", // Смещаем влево, чтобы выровнять по центру
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Сетка временных интервалов для каждого устройства */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {bookings.map((device) => (
            <Grid item xs={12} md={3} key={device.id}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {device.name} {/* Название из ответа сервера */}
              </Typography>
              {timeSlots.map((hour) => {
                const isBooked = isTimeSlotBooked(device.id, hour);
                const isSelected = (selectedTimes[device.id] || []).includes(
                  hour
                );

                return (
                  <Button
                    key={hour}
                    variant="outlined"
                    onClick={() => handleTimeSlotToggle(device.id, hour)}
                    sx={{
                      mr: 1,
                      mb: 1,
                      width: "80px",
                      backgroundColor: isBooked
                        ? "rgba(255, 99, 71, 0.2)" // Светло-красный для занятых
                        : isSelected
                        ? "#d3bb8a" // Фон выбранного (коричневый, как в теме)
                        : "rgba(255, 255, 255, 0.1)", // Прозрачный фон для свободных
                      color: isSelected
                        ? "#0f1621" // Текст выбранного (черный, как фон темы)
                        : isBooked
                        ? "text.primary" // Белый текст для занятых
                        : "text.primary", // Белый текст для свободных
                      borderColor: isBooked
                        ? "rgba(255, 99, 71, 0.5)" // Обводка для занятых
                        : "text.secondary", // Черная обводка для свободных/выбранных
                      "&:hover": {
                        backgroundColor: isBooked
                          ? "rgba(255, 99, 71, 0.3)" // Более светлый красный при наведении на занятые
                          : isSelected
                          ? "#b89f6e" // Более темный коричневый при наведении на выбранные
                          : "background.default", // Темный при наведении на свободные
                        borderColor: isBooked
                          ? "rgba(255, 99, 71, 0.5)"
                          : isSelected
                          ? "#b89f6e" // Более темный коричневый при наведении на выбранные
                          : "rgba(255, 255, 255, 0.1)", // Прозрачный фон для свободных,
                      },
                      disabled: isBooked, // Отключаем нажатие на занятые интервалы
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

      {/* Контейнер с формой, описанием и деталями заказа (по центру) */}
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
            required // Делаем поле обязательным
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
            placeholder={t("description")}
            value={userDetails.description}
            onChange={(e) =>
              setUserDetails({ ...userDetails, description: e.target.value })
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

        {/* Отображение выбранной брони (показывается только при выборе) */}
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
              {40 * Object.values(selectedTimes).flat().length},-
            </Typography>
          </Box>
        )}
      </Box>

      {/* Кнопка под yourBooking */}
      <Box sx={{ width: 1, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBooking}
          sx={{ mt: 4 }}
        >
          {t("confirmBooking")}
        </Button>
      </Box>
    </Box>
  );
};
