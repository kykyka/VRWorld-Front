import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { Header, Footer } from "./components";
import { Home, Booking } from "./pages";
import Games from "./pages/Games/index.js";
import GameDetail from "./pages/Games/GameDetail.js";

function App() {
  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetail />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
