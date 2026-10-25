import { useParams, Link, Navigate } from "react-router-dom";
import { useContratoStore } from "../store/useContratoStore.js";
import { useFornecedorStore } from "../store/useFornecedorStore.js";

// Helpr functions
function formatDate(value) {
  if (!value) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "")
    return "Não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export default function ContratoPage() {
  // Id from parameter variable
  const { id } = useParams();

  // Get state variables from store
  const contratos = useContratoStore((state) => state.contratos);
  const fornecedores = useFornecedorStore((state) => state.fornecedores);

  const deletarContrato = useContratoStore((state) => state.deletarContrato);

  // Get this contract and fornecedor
  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const fornecedor = fornecedores.find(
    (fornecedor) => fornecedor.id === Number(contrato?.fornecedor_id),
  );

  // Guard clause: if contract is deleted or not found, stop rendering
  if (!contrato) {
    return <Navigate to="/contratos" replace />;
  }

  const handleDelete = (contractId) => {
    deletarContrato(contractId);
  };

  return (
    <section className="detail-page contract-detail">
      <header className="detail-header">
        <div>
          <p className="eyebrow">Detalhes do contrato</p>
          <h1>Contrato nº {contrato.numero}</h1>
          <p className="detail-subtitle">
            Registro completo, vigência e vínculo com o fornecedor.
          </p>
        </div>
        <span>
          <Link to={`/contratos/editar/${contrato.id}`}>
            <button className="button-primary">Editar contrato</button>
          </Link>

          <button
            className="button-danger"
            onClick={() => handleDelete(contrato.id)}
          >
            Deletar
          </button>
        </span>
      </header>

      <div className="detail-card object-card">
        <span className="detail-label">Objeto do contrato</span>
        <p>{contrato.objeto}</p>
      </div>

      <div className="detail-card">
        <div className="detail-card-heading">
          <h2>Informações principais</h2>
          <span className="status-badge">{contrato.status}</span>
        </div>
        <dl className="detail-grid">
          <div>
            <dt>Fornecedor</dt>
            <dd>
              <Link to={`/fornecedor/${fornecedor.id}`}>
                {fornecedor.razao_social}
              </Link>
            </dd>
          </div>
          <div>
            <dt>Procedimento</dt>
            <dd>{contrato.procedimento_id}</dd>
          </div>
          <div>
            <dt>Valor global</dt>
            <dd>{formatCurrency(contrato.valor_global)}</dd>
          </div>
          <div>
            <dt>Prorrogável</dt>
            <dd>{contrato.prorrogavel || "Não informado"}</dd>
          </div>
        </dl>
      </div>

      <div className="detail-card">
        <div className="detail-card-heading">
          <h2>Vigência</h2>
        </div>
        <dl className="detail-grid detail-grid-two">
          <div>
            <dt>Data da assinatura</dt>
            <dd>{formatDate(contrato.data_de_assinatura)}</dd>
          </div>
          <div>
            <dt>Data de término</dt>
            <dd>{formatDate(contrato.data_de_termino)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
