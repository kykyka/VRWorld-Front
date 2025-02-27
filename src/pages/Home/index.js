import { useEffect } from "react";
import { Box } from "@mui/material";
import HeroSection from "../../components/Home/HeroSection";

export const Home = () => {
  // Прокрутка к началу страницы при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box>
      <HeroSection />
    </Box>
  );
};
