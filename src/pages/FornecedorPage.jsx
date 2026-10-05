import { useParams } from "react-router-dom";
import TabelaContratos from "../components/TabelaContratos";

export default function FornecedorPage({ fornecedores, setFornecedores, contratos, setContratos }) {
  const { id } = useParams();

  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(id));

  return (
    <section className="detail-page supplier-detail">
      <header className="detail-header">
        <div>
          <p className="eyebrow">Cadastro de fornecedor</p>
          <h1>{fornecedor.razao_social}</h1>
          <p className="detail-subtitle">Dados cadastrais e contratos relacionados a este fornecedor.</p>
        </div>
        <span className="status-badge">{fornecedor.status}</span>
      </header>

      <div className="detail-card">
        <div className="detail-card-heading">
          <h2>Dados cadastrais</h2>
          <span className="type-badge">{fornecedor.tipo}</span>
        </div>
        <dl className="detail-grid">
          <div><dt>CPF/CNPJ</dt><dd>{fornecedor.cpf_cnpj}</dd></div>
          <div><dt>Nome fantasia</dt><dd>{fornecedor.nome_fantasia || "Não informado"}</dd></div>
          <div><dt>E-mail</dt><dd>{fornecedor.email || "Não informado"}</dd></div>
          <div><dt>Telefone</dt><dd>{fornecedor.telefone || "Não informado"}</dd></div>
          <div><dt>Representante legal</dt><dd>{fornecedor.representante_legal || "Não informado"}</dd></div>
          <div><dt>Localização</dt><dd>{fornecedor.cidade}/{fornecedor.estado}</dd></div>
        </dl>
      </div>

      <TabelaContratos contratos={contratos.filter((contrato) => contrato.fornecedor_id === Number(id))} setContratos={setContratos} fornecedores={fornecedores} />
    </section>
  );
}
