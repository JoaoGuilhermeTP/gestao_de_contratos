import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/ContratosPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import ContratoPage from "./pages/ContratoPage";
import AdicionarContratoPage from "./pages/AdicionarContratoPage";
import EditarContratoPage from "./pages/EditarContratoPage";
import FornecedorPage from "./pages/FornecedorPage";
import { useContratoStore } from "./store/useContratoStore";
import { useFornecedorStore } from "./store/useFornecedorStore";

function App() {
  const loading = useContratoStore((state) => state.loading);
  const fetchContratos = useContratoStore((state) => state.fetchContratos);
  const fetchFornecedores = useFornecedorStore((state) => state.fetchFornecedores);

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
        <Route path={`/contratos/editar/:id`} element={<EditarContratoPage />} />
        <Route path={"/adicionar_contrato"} element={<AdicionarContratoPage />} />
        <Route path={`/fornecedor/:id`} element={<FornecedorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
