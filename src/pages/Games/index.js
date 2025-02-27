import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GradientCircularProgress from "../../components/Loaders/GradientCircularProgress";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Games = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  const currentLang = i18n.language || "de";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const baseURL =
          process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseURL}/games`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setGames(result.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games, using mock data:", error);
        const mockResponse = {
          data: [
            {
              texts: {
                ru: {
                  preview: "Крутой шутер",
                  description: "Полное описание игры",
                },
                de: {
                  preview: "Cooler Shooter",
                  description: "Vollständige Spielbeschreibung",
                },
                en: {
                  preview: "Cool Shooter",
                  description: "Full game description",
                },
              },
              game_genre: {
                en: ["shooter", "action"],
                ru: ["стрелалка", "экшн"],
                de: ["shooter", "aktion"],
              },
              name: "VR Shooter",
              image:
                "https://escapehunt.com/wp-content/uploads/sites/70/2020/10/EH-Survival-Local-Game-Hero.jpg",
              images: [
                "https://images.unsplash.com/photo-1612287230202-1ff1d85d761f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1591370239633-c6e8e9e8c4fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 8,
              outside: false,
              max_players_count: 4,
            },
            {
              texts: {
                ru: {
                  preview: "Гонки в VR",
                  description: "Скоростные гонки в виртуальной реальности",
                },
                de: {
                  preview: "VR-Rennen",
                  description:
                    "Hochgeschwindigkeitsrennen in virtueller Realität",
                },
                en: {
                  preview: "VR Racing",
                  description: "High-speed racing in virtual reality",
                },
              },
              game_genre: {
                en: ["racing", "simulation"],
                ru: ["гонки", "симулятор"],
                de: ["rennen", "simulation"],
              },
              name: "VR Racer",
              image:
                "https://c4.wallpaperflare.com/wallpaper/519/347/693/5bd106835c103-wallpaper-preview.jpg",
              images: [
                "https://images.unsplash.com/photo-1626151213004-7a05aa6db32f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1591370239633-c6e8e9e8c4fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 10,
              outside: false,
              max_players_count: 2,
            },
            {
              texts: {
                ru: {
                  preview: "Приключение в космосе",
                  description: "Исследуйте космос и сражайтесь с врагами",
                },
                de: {
                  preview: "Abenteuer im Weltraum",
                  description: "Erkunde den Weltraum und kämpfe gegen Feinde",
                },
                en: {
                  preview: "Space Adventure",
                  description: "Explore space and fight enemies",
                },
              },
              game_genre: {
                en: ["adventure", "sci-fi"],
                ru: ["приключение", "научная фантастика"],
                de: ["abenteuer", "sci-fi"],
              },
              name: "Space Quest",
              image:
                "https://miro.medium.com/v2/resize:fit:1400/1*2MTeG3JJhQtbyUXmLzIniw.png",
              images: [
                "https://images.unsplash.com/photo-1600585154347-6e9e6b3e5b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1591370239633-c6e8e9e8c4fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 12,
              outside: false,
              max_players_count: 6,
            },
            {
              texts: {
                ru: {
                  preview: "Сражение с зомби",
                  description: "Выживайте в мире, полном зомби",
                },
                de: {
                  preview: "Zombie-Schlacht",
                  description: "Überlebe in einer Welt voller Zombies",
                },
                en: {
                  preview: "Zombie Battle",
                  description: "Survive in a world full of zombies",
                },
              },
              game_genre: {
                en: ["horror", "survival"],
                ru: ["хоррор", "выживание"],
                de: ["horror", "überleben"],
              },
              name: "Zombie Apocalypse",
              image:
                "https://image.api.playstation.com/vulcan/ap/rnd/202302/1000/cca9561ada20a890dd1074fd71bc6fd7eaefb800edc52cc7.jpg",
              images: [
                "https://images.unsplash.com/photo-1600585154347-6e9e6b3e5b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1591370239633-c6e8e9e8c4fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 16,
              outside: true,
              max_players_count: 8,
            },
            {
              texts: {
                ru: {
                  preview: "Средневековые битвы",
                  description: "Сражайтесь как рыцарь в средневековье",
                },
                de: {
                  preview: "Mittelalterliche Kämpfe",
                  description: "Kämpfe wie ein Ritter im Mittelalter",
                },
                en: {
                  preview: "Medieval Battles",
                  description: "Fight like a knight in the Middle Ages",
                },
              },
              game_genre: {
                en: ["action", "history"],
                ru: ["экшн", "историческая"],
                de: ["aktion", "historisch"],
              },
              name: "Knight's Quest",
              image:
                "https://image.api.playstation.com/vulcan/ap/rnd/202302/1000/cca9561ada20a890dd1074fd71bc6fd7eaefb800edc52cc7.jpg",
              images: [
                "https://images.unsplash.com/photo-1600585154347-6e9e6b3e5b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1591370239633-c6e8e9e8c4fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 14,
              outside: true,
              max_players_count: 5,
            },
          ],
        };
        setGames(mockResponse.data);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Функции для прокрутки стрелок
  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector("div > div").offsetWidth + 16;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector("div > div").offsetWidth + 16;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: 1,
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          py: 10,
        }}
      >
        <GradientCircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        p: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t("games")}
      </Typography>
      <Box sx={{ position: "relative" }}>
        {/* Стрелки для прокрутки (только на десктопе) */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            zIndex: 2,
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "text.secondary",
            backgroundColor: "background.light",
            display: { xs: "none", md: "block" },
            "&:hover": {
              backgroundColor: "text.tertiary", // Коричневый фон
            },
            "& .MuiSvgIcon-root": {
              transform: "translateX(4px)",
            },
            width: 40, // Фиксированная ширина для круглой формы
            height: 40, // Фиксированная высота для круглой формы
            borderRadius: "50%", // Делаем кнопку круглой
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={scrollRight}
          sx={{
            zIndex: 2,
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "text.secondary",
            backgroundColor: "background.light",
            display: { xs: "none", md: "block" },
            "&:hover": {
              backgroundColor: "text.tertiary", // Коричневый фон
            },
            "& .MuiSvgIcon-root": {
              transform: "translateX(1px)",
            },
            width: 40, // Фиксированная ширина для круглой формы
            height: 40, // Фиксированная высота для круглой формы
            borderRadius: "50%", // Делаем кнопку круглой
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Box
          ref={carouselRef}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflowX: { xs: "visible", md: "auto" },
            gap: 6,
            pb: 2,
            scrollSnapType: { xs: "none", md: "x mandatory" },
            "&::-webkit-scrollbar": {
              height: "6px",
              display: { xs: "none", md: "block" },
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "text.primary",
              borderRadius: "4px",
            },
          }}
        >
          {games.map((game, index) => (
            <Card
              key={index}
              onClick={() => navigate(`/games/${index}`)}
              sx={{
                minWidth: { xs: "100%", md: "60%" },
                maxWidth: { xs: "100%", md: "60%" },
                minHeight: { xs: "auto", md: 350 },
                backgroundColor: "background.default",
                color: "text.primary",
                cursor: "pointer",
                transform: "none", // Убираем искривление полностью
                scrollSnapAlign: { xs: "none", md: "start" },
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: { xs: "scale(1.02)", md: "scale(1.05)" }, // Оставляем только увеличение при наведении
                },
              }}
            >
              <CardMedia
                component="img"
                height={{ xs: 140, md: 180 }}
                image={game.image}
                alt={game.name}
                sx={{ borderRadius: "4px 4px 0 0", maxHeight: 400 }}
              />
              <CardContent>
                <Typography variant="h6">{game.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.texts[currentLang]?.preview || game.texts["en"].preview}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {t("minAge")}: {game.age}+
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {t("maxPlayers")}: {game.max_players_count}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {t("genre")}:{" "}
                  {(game.game_genre[currentLang] || game.game_genre["en"])
                    .map((genre) => t(genre))
                    .join(", ")}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Games;
