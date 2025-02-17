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
          {/* <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} /> */}
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
