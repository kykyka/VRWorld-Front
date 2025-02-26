import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { Header, Footer } from "./components";
import { Home, Booking } from "./pages";

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
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
