// import "./App.css";
import { mockContratos } from "./mock/mockContratos";
import { mockFornecedores } from "./mock/mockFornecedores";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/ContratosPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import ContratoPage from "./pages/ContratoPage";
import AdicionarContratoPage from "./pages/AdicionarContratoPage";
import FornecedorPage from "./pages/FornecedorPage";

function App() {
  const [contratos, setContratos] = useState(mockContratos);
  const [fornecedores, setFornecedores] = useState(mockFornecedores);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratos" element={<ContratosPage contratos={contratos} setContratos={setContratos} fornecedores={fornecedores} />} />
        <Route path="/fornecedores" element={<FornecedoresPage fornecedores={fornecedores} setFornecedores={setFornecedores} />} />
        <Route path={`/contratos/:id`} element={<ContratoPage contratos={contratos} setContratos={setContratos} fornecedores={fornecedores} />} />
        <Route path={"/adicionar_contrato"} element={<AdicionarContratoPage contratos={contratos} setContratos={setContratos} fornecedores={fornecedores} />} />
        <Route path={`/fornecedor/:id`} element={<FornecedorPage fornecedores={fornecedores} setFornecedores={setFornecedores} contratos={contratos} setContratos={setContratos} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
