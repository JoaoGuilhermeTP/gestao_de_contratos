// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/contratosPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import { mockContratos } from "./mock/mockContratos";
import { useState } from "react";
import Contrato from "./components/Contrato";

function App() {

  const [contratos, setContratos] = useState(mockContratos);

  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratos" element={<ContratosPage contratos={contratos} setContratos={setContratos} />} />
        <Route path={`/contratos/:id`} element={<Contrato contratos={contratos} setContratos={setContratos} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;