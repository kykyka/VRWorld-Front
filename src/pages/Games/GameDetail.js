import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, CardMedia } from "@mui/material";
import { useTranslation } from "react-i18next";

const GameDetail = () => {
  const { id } = useParams(); // Получаем ID игры из URL
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language || "de";

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const baseURL =
          process.env.REACT_APP_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${baseURL}/games`); // Предполагаемый эндпоинт

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const gameData = result.data[parseInt(id)];
        setGame(gameData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game, using mock data:", error);
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
                "https://miro.medium.com/v2/resize:fit:1400/1*2MTeG3JJhQtbyUXmLzIniw.png",
              images: [
                "https://c4.wallpaperflare.com/wallpaper/519/347/693/5bd106835c103-wallpaper-preview.jpg",
                "https://escapehunt.com/wp-content/uploads/sites/70/2020/10/EH-Survival-Local-Game-Hero.jpg",
                "https://image.api.playstation.com/vulcan/ap/rnd/202302/1000/cca9561ada20a890dd1074fd71bc6fd7eaefb800edc52cc7.jpg",
              ],
              videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
              age: 8,
              outside: false,
              max_players_count: 4,
            },
          ],
        };
        const gameData = mockResponse.data[parseInt(id)];
        setGame(gameData);
        setLoading(false);
      }
    };
    fetchGame();

    // Прокрутка к началу страницы
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading || !game) {
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
      <Button onClick={() => navigate("/games")} sx={{ mb: 2 }}>
        {t("backToGames")}
      </Button>
      <Typography variant="h4" gutterBottom>
        {game.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={game.image}
            alt={game.name}
            sx={{ borderRadius: "4px", mb: 2 }}
          />
          <Typography variant="h6">{t("description")}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {game.texts[currentLang]?.description ||
              game.texts["en"].description}
          </Typography>
          <Typography variant="body1">
            {t("minAge")}: {game.age}+
          </Typography>
          <Typography variant="body1">
            {t("maxPlayers")}: {game.max_players_count}
          </Typography>
          <Typography variant="body1">
            {t("genre")}:{" "}
            {(game.game_genre[currentLang] || game.game_genre["en"])
              .map((genre) => t(genre))
              .join(", ")}
          </Typography>
          <Typography variant="body1">
            {t("outside")}: {game.outside ? t("yes") : t("no")}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {t("gallery")}
          </Typography>
          {/* Фото */}
          {game.images.map((image, index) => (
            <CardMedia
              key={index}
              component="img"
              image={image}
              alt={`${game.name} image ${index + 1}`}
              sx={{ borderRadius: "4px", mb: 2 }}
            />
          ))}
          {/* Видео */}
          {game.videos.map((video, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <iframe
                width="100%"
                height="315"
                src={video}
                title={`${game.name} video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameDetail;
