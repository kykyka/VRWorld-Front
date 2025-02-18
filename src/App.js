import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { Header, Footer } from "./components";
import { Home } from "./pages";

function App() {
  return (
    <>
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
