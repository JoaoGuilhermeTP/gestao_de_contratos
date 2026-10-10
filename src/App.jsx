import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/ContratosPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import ContratoPage from "./pages/ContratoPage";
import AdicionarContratoPage from "./pages/AdicionarContratoPage";
import FornecedorPage from "./pages/FornecedorPage";
import { useContractStore } from "./store/useContractStore";

function App() {

    const loading = useContractStore((state) => state.loading);
    const fetchContratos = useContractStore((state) => state.fetchContratos);
    const fetchFornecedores = useContractStore((state) => state.fetchFornecedores);

  useEffect(() => {
    fetchContratos();
    fetchFornecedores();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", fontFamily: "DM Sans" }}>Conectando ao banco de dados...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratos" element={<ContratosPage />} />
        <Route path="/fornecedores" element={<FornecedoresPage />} />
        <Route path={`/contratos/:id`} element={<ContratoPage />} />
        <Route path={"/adicionar_contrato"} element={<AdicionarContratoPage />} />
        <Route path={`/fornecedor/:id`} element={<FornecedorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
