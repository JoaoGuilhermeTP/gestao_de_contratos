// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/contratosPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratos" element={<ContratosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;