// import "./App.css";
import { mockContratos } from "./mock/mockContratos";
import { mockFornecedores } from "./mock/mockFornecedores";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContratosPage from "./pages/ContratosPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import ContratoPage from "./pages/ContratoPage";
import AdicionarContratoPage from "./pages/AdicionarContratoPage";
import FornecedorPage from "./pages/FornecedorPage";

function App() {
  const [contratos, setContratos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend when the app mounts
  useEffect(() => {
    Promise.all([
      fetch("/api/contratos").then((res) => res.json()),
      fetch("/api/fornecedores").then((res) => res.json()),
    ])
      .then(([contratosData, fornecedoresData]) => {
        setContratos(contratosData);
        // Apenas atualiza se for um array, senão mantém vazio
        setFornecedores(
          Array.isArray(fornecedoresData) ? fornecedoresData : [],
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do banco: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{ padding: "40px", textAlign: "center", fontFamily: "DM Sans" }}
      >
        Conectando ao banco de dados...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/contratos"
          element={
            <ContratosPage
              contratos={contratos}
              setContratos={setContratos}
              fornecedores={fornecedores}
            />
          }
        />
        <Route
          path="/fornecedores"
          element={
            <FornecedoresPage
              fornecedores={fornecedores}
              setFornecedores={setFornecedores}
            />
          }
        />
        <Route
          path={`/contratos/:id`}
          element={
            <ContratoPage
              contratos={contratos}
              setContratos={setContratos}
              fornecedores={fornecedores}
            />
          }
        />
        <Route
          path={"/adicionar_contrato"}
          element={
            <AdicionarContratoPage
              contratos={contratos}
              setContratos={setContratos}
              fornecedores={fornecedores}
            />
          }
        />
        <Route
          path={`/fornecedor/:id`}
          element={
            <FornecedorPage
              fornecedores={fornecedores}
              setFornecedores={setFornecedores}
              contratos={contratos}
              setContratos={setContratos}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
