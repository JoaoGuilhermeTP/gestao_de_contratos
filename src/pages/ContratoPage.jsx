import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

function formatDate(value) {
  if (!value) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "Não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export default function ContratoPage({ contratos, setContratos, fornecedores }) {
  // Id from parameter variable
  const { id } = useParams();

  // Get this contract and it's supplier from props
  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(contrato.fornecedor_id));

  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(contrato);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newContratos = contratos.map((contrato) => (contrato.id === Number(id) ? edited : contrato));
    setContratos(newContratos);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <section className="detail-page contract-detail">
        <header className="detail-header">
          <div>
            <p className="eyebrow">Edição de contrato</p>
            <h1>Contrato nº {contrato.numero}</h1>
            <p>Atualize os dados cadastrais e a vigência deste contrato.</p>
          </div>
        </header>

        <form className="detail-form" onSubmit={handleSubmit}>
          <label>
            Número
            <input type="number" value={edited.numero} onChange={(e) => setEdited({ ...edited, numero: e.target.value })} />
          </label>
          <label>
            Ano
            <input type="number" value={edited.ano} onChange={(e) => setEdited({ ...edited, ano: e.target.value })} />
          </label>
          <label className="field-wide">
            Objeto
            <input type="text" value={edited.objeto} onChange={(e) => setEdited({ ...edited, objeto: e.target.value })} />
          </label>
          <label>
            Fornecedor
            <select
              value={edited.fornecedor_id}
              onChange={(e) => setEdited({ ...edited, fornecedor_id: Number(e.target.value) })}
            >
              <option value="" disabled>Selecione um fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.razao_social} - {fornecedor.cpf_cnpj}
                </option>
              ))}
            </select>
          </label>
          <label>
            Procedimento
            <input type="text" value={edited.procedimento_id} onChange={(e) => setEdited({ ...edited, procedimento_id: e.target.value })} />
          </label>
          <label>
            Tipo
            <input type="text" value={edited.tipo} onChange={(e) => setEdited({ ...edited, tipo: e.target.value })} />
          </label>
          <label>
            Data da assinatura
            <input type="date" value={edited.data_de_assinatura} onChange={(e) => setEdited({ ...edited, data_de_assinatura: e.target.value })} />
          </label>
          <label>
            Data de término
            <input type="date" value={edited.data_de_termino} onChange={(e) => setEdited({ ...edited, data_de_termino: e.target.value })} />
          </label>
          <div className="detail-form-actions">
            <button type="button" className="button-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
            <button type="submit" className="button-primary">Salvar alterações</button>
          </div>
        </form>
      </section>
    );
  } else {
    return (
      <section className="detail-page contract-detail">
        <header className="detail-header">
          <div>
            <p className="eyebrow">Detalhes do contrato</p>
            <h1>Contrato nº {contrato.numero}</h1>
            <p className="detail-subtitle">Registro completo, vigência e vínculo com o fornecedor.</p>
          </div>
          <button className="button-primary" onClick={() => setIsEditing(true)}>Editar contrato</button>
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
            <div><dt>Fornecedor</dt><dd><Link to={`/fornecedor/${fornecedor.id}`}>{fornecedor.razao_social}</Link></dd></div>
            <div><dt>Procedimento</dt><dd>{contrato.procedimento_id}</dd></div>
            <div><dt>Valor global</dt><dd>{formatCurrency(contrato.valor_global)}</dd></div>
            <div><dt>Prorrogável</dt><dd>{contrato.prorrogavel || "Não informado"}</dd></div>
          </dl>
        </div>

        <div className="detail-card">
          <div className="detail-card-heading">
            <h2>Vigência</h2>
          </div>
          <dl className="detail-grid detail-grid-two">
            <div><dt>Data da assinatura</dt><dd>{formatDate(contrato.data_de_assinatura)}</dd></div>
            <div><dt>Data de término</dt><dd>{formatDate(contrato.data_de_termino)}</dd></div>
          </dl>
        </div>
      </section>
    );
  }
}
