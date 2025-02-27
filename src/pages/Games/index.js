import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Games = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language || "de"; // Текущий язык

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const baseURL =
          process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseURL}/games`); // Предполагаемый эндпоинт для игр

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
              image: "https://via.placeholder.com/300x200", // Главное фото
              images: [
                "https://via.placeholder.com/300",
                "https://via.placeholder.com/300",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 8,
              outside: false,
              max_players_count: 4,
            },
          ],
        };
        setGames(mockResponse.data);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
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
      <Box
        sx={{
          display: "flex",
          overflowX: "auto", // Горизонтальная прокрутка
          gap: 2,
          pb: 2,
          scrollSnapType: "x mandatory", // Прокрутка с привязкой к карточкам
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "text.tertiary",
            borderRadius: "4px",
          },
        }}
      >
        {games.map((game, index) => (
          <Card
            key={index}
            onClick={() => navigate(`/games/${index}`)} // Переход на страницу игры
            sx={{
              minWidth: 300,
              maxWidth: 300,
              backgroundColor: "background.default",
              color: "text.primary",
              cursor: "pointer",
              transform: "rotate(2deg)", // Лёгкое искривление карточек
              "&:nth-of-type(even)": {
                transform: "rotate(-2deg)", // Чередуем направление искривления
              },
              scrollSnapAlign: "start", // Привязка прокрутки к началу карточки
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "rotate(0deg) scale(1.05)", // При наведении убираем искривление и слегка увеличиваем
              },
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={game.image}
              alt={game.name}
              sx={{ borderRadius: "4px 4px 0 0" }}
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
                  .map((genre) => t(genre)) // Локализуем жанры, если они есть в переводах
                  .join(", ")}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Games;
