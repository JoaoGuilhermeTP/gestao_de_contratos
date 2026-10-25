import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import TabelaContratos from "../components/TabelaContratos";
import { useContratoStore } from "../store/useContratoStore.js";
import { useFornecedorStore } from "../store/useFornecedorStore.js";
import DocumentosFornecedor from "../components/DocumentosFornecedor.jsx";

export default function FornecedorPage() {
  // Get fornecedor id from parameters
  const { id } = useParams();

  // State variables
  const [activeTab, setActiveTab] = useState("documentos");
  const fornecedores = useFornecedorStore((status) => status.fornecedores);
  const contratos = useContratoStore((status) => status.contratos);

  // Get current fornecedor
  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(id));

  // If fornecedor is not found, redirect to /fornecedores
  if (!fornecedor) {
    return <Navigate to="/fornecedores" replace />;
  }

  return (
    <section className="detail-page supplier-detail">
      <header className="detail-header">
        <div>
          <p className="eyebrow">Cadastro de fornecedor</p>
          <h1>{fornecedor.razao_social}</h1>
          <p className="detail-subtitle">Dados cadastrais e contratos relacionados a este fornecedor.</p>
        </div>
        <span>
          <Link to={`/fornecedor/editar/${fornecedor.id}`}>
            <button className="button-primary">Editar fornecedor</button>
          </Link>
        </span>
      </header>

      <div className="detail-card">
        <div className="detail-card-heading">
          <h2>Dados cadastrais</h2>
          <span className="type-badge">{fornecedor.tipo}</span>
          <span className="status-badge">{fornecedor.status}</span>
        </div>
        <dl className="detail-grid">
          <div>
            <dt>CPF/CNPJ</dt>
            <dd>{fornecedor.cpf_cnpj}</dd>
          </div>
          <div>
            <dt>Nome fantasia</dt>
            <dd>{fornecedor.nome_fantasia || "Não informado"}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{fornecedor.email || "Não informado"}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{fornecedor.telefone || "Não informado"}</dd>
          </div>
          <div>
            <dt>Representante legal</dt>
            <dd>{fornecedor.representante_legal || "Não informado"}</dd>
          </div>
          <div>
            <dt>Localização</dt>
            <dd>
              {fornecedor.cidade}/{fornecedor.estado}
            </dd>
          </div>
        </dl>
      </div>

      <div className="supplier-tabs" role="tablist" aria-label="Informações do fornecedor">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "documentos"}
          className={`supplier-tab ${activeTab === "documentos" ? "supplier-tab-active" : ""}`}
          onClick={() => setActiveTab("documentos")}
        >
          Documentos
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "contratos"}
          className={`supplier-tab ${activeTab === "contratos" ? "supplier-tab-active" : ""}`}
          onClick={() => setActiveTab("contratos")}
        >
          Contratos
        </button>
      </div>

      {activeTab === "documentos" && <DocumentosFornecedor fornecedorId={id} />}
      {activeTab === "contratos" && <TabelaContratos fornecedorId={id} />}
    </section>
  );
}
