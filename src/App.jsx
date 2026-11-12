import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ContratosPage from "./pages/ContratosPage";
import ContratoPage from "./pages/ContratoPage";
import AdicionarContratoPage from "./pages/AdicionarContratoPage";
import EditarContratoPage from "./pages/EditarContratoPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import FornecedorPage from "./pages/FornecedorPage";
import AdicionarFornecedorPage from "./pages/AdicionarFornecedorPage";
import EditarFornecedorPage from "./pages/EditarFornecedorPage";
import DocumentosPage from "./pages/DocumentosPage";
import AdicionarDocumentoPage from "./pages/AdicionarDocumentoPage";
import AdicionarDocumentoFornecedorPage from "./pages/AdicionarDocumentoFornecedorPage";
import ServidoresPage from "./pages/ServidoresPage";
import ServidorPage from "./pages/ServidorPage";
import AdicionarServidorPage from "./pages/AdicionarServidorPage";
import EditarServidorPage from "./pages/EditarServidorPage";
import { useContratoStore } from "./store/useContratoStore";
import { useFornecedorStore } from "./store/useFornecedorStore";
import { useIbgeStore } from "./store/useIbgeStore";
import { useDocumentoStore } from "./store/useDocumentoStore";
import { useServidorStore } from "./store/useServidorStore";
import { useSecretariaStore } from "./store/useSecretariaStore";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchContratos = useContratoStore((state) => state.fetchContratos);
  const fetchFornecedores = useFornecedorStore((state) => state.fetchFornecedores);
  const fetchEstados = useIbgeStore((state) => state.fetchEstados);
  const fetchDocumentos = useDocumentoStore((state) => state.fetchDocumentos);
  const fetchServidores = useServidorStore((state) => state.fetchServidores);
  const fetchSecretarias = useSecretariaStore((state) => state.fetchSecretarias);

  useEffect(() => {
    async function loadInitialData() {
      // Dispara a busca do IBGE em paralelo sem bloquear o carregamento do banco
      fetchEstados();
      await Promise.all([fetchContratos(), fetchFornecedores(), fetchDocumentos(), fetchServidores(), fetchSecretarias()]);
      setIsInitializing(false);
    }
    loadInitialData();
  }, [fetchContratos, fetchFornecedores, fetchEstados, fetchDocumentos, fetchServidores, fetchSecretarias]);

  return (
    <BrowserRouter>
      <Navbar />
      {isInitializing ? (
        <main style={{ textAlign: "center" }}>
          <p>Conectando ao banco de dados...</p>
        </main>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Contratos */}
          <Route path="/contratos" element={<ContratosPage />} />
          <Route path="/contratos/:id" element={<ContratoPage />} />
          <Route path="/contratos/editar/:id" element={<EditarContratoPage />} />
          <Route path="/adicionar_contrato" element={<AdicionarContratoPage />} />

          {/* Fornecedores */}
          <Route path="/fornecedores" element={<FornecedoresPage />} />
          <Route path="/fornecedor/:id" element={<FornecedorPage />} />
          <Route path="/fornecedor/editar/:id" element={<EditarFornecedorPage />} />
          <Route path="/adicionar_fornecedor" element={<AdicionarFornecedorPage />} />
          <Route path="/fornecedor/:id/adicionar-documento" element={<AdicionarDocumentoFornecedorPage />} />

          {/* Documentos */}
          <Route path="/documentos" element={<DocumentosPage />} />
          <Route path="/adicionar_documento" element={<AdicionarDocumentoPage />} />

          {/* Servidores */}
          <Route path="/servidores" element={<ServidoresPage />} />
          <Route path="/servidor/:id" element={<ServidorPage />} />
          <Route path="/servidor/editar/:id" element={<EditarServidorPage />} />
          <Route path="/adicionar_servidor" element={<AdicionarServidorPage />} />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <main>
                <h1>Página não encontrada</h1>
                <p>O endereço que você tentou acessar não existe.</p>
                <Link to="/">Voltar para o início</Link>
              </main>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
