import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDocumentoStore } from "../store/useDocumentoStore.js";
import { useFornecedorStore } from "../store/useFornecedorStore.js";

const initialDocumentoFornecedor = {
  esfera: "",
  documento_id: "",
  emissao: "",
  validade: "",
  arquivo_url: "",
  status: "Válido",
};

export default function AdicionarDocumentoFornecedorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fornecedor = useFornecedorStore((state) =>
    state.fornecedores.find((item) => item.id === Number(id)),
  );
  const documentos = useDocumentoStore((state) => state.documentos);
  const addDocumentoAoFornecedor = useDocumentoStore(
    (state) => state.addDocumentoAoFornecedor,
  );
  const [form, setForm] = useState(initialDocumentoFornecedor);
  const [error, setError] = useState("");

  if (!fornecedor) {
    return <Navigate to="/fornecedores" replace />;
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const documentosDisponiveis = documentos.filter((documento) => {
    if (!form.esfera || documento.esfera !== form.esfera) {
      return false;
    }

    if (form.esfera === "Estadual") {
      return documento.estado?.toUpperCase() === fornecedor.estado?.toUpperCase();
    }

    if (form.esfera === "Municipal") {
      return (
        documento.estado?.toUpperCase() === fornecedor.estado?.toUpperCase() &&
        documento.cidade?.toLowerCase() === fornecedor.cidade?.toLowerCase()
      );
    }

    return true;
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.esfera || !form.documento_id || !form.emissao || !form.validade) {
      setError("Esfera, documento, data de emissão e validade são obrigatórios.");
      return;
    }

    if (form.validade < form.emissao) {
      setError("A validade deve ser posterior à data de emissão.");
      return;
    }

    try {
      await addDocumentoAoFornecedor(Number(id), {
        ...form,
        documento_id: Number(form.documento_id),
      });
      navigate(`/fornecedor/${id}`);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Documentos do fornecedor</p>
          <h1>Novo documento</h1>
          <p>Vincule uma certidão ou documento a {fornecedor.razao_social}.</p>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <label className="field-wide">
          Esfera
          <select
            value={form.esfera}
            onChange={(event) => {
              updateField("esfera", event.target.value);
              updateField("documento_id", "");
            }}
          >
            <option value="" disabled>Selecione a esfera</option>
            <option value="Federal">Federal</option>
            <option value="Estadual">Estadual</option>
            <option value="Municipal">Municipal</option>
            <option value="Trabalhista">Trabalhista</option>
          </select>
        </label>

        <label className="field-wide">
          Documento
          <select
            value={form.documento_id}
            onChange={(event) => updateField("documento_id", event.target.value)}
            disabled={!form.esfera}
          >
            <option value="" disabled>
              {form.esfera ? "Selecione um documento" : "Selecione a esfera primeiro"}
            </option>
            {documentosDisponiveis.map((documento) => (
              <option key={documento.id} value={documento.id}>
                {documento.nome_documento} — {documento.esfera}
              </option>
            ))}
          </select>
          {form.esfera && documentosDisponiveis.length === 0 && (
            <span className="form-error">
              Nenhum documento disponível para a esfera e localidade deste fornecedor.
            </span>
          )}
        </label>

        <label>
          Data de emissão
          <input type="date" value={form.emissao} onChange={(event) => updateField("emissao", event.target.value)} />
        </label>

        <label>
          Data de validade
          <input type="date" value={form.validade} onChange={(event) => updateField("validade", event.target.value)} />
        </label>

        <label className="field-wide">
          URL do arquivo
          <input type="url" value={form.arquivo_url} onChange={(event) => updateField("arquivo_url", event.target.value)} placeholder="https://..." />
        </label>

        <label>
          Status
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="Válido">Válido</option>
            <option value="Vencido">Vencido</option>
            <option value="Pendente">Pendente</option>
          </select>
        </label>

        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <Link to={`/fornecedor/${id}`}>
            <button type="button" className="button-secondary">Cancelar</button>
          </Link>
          <button type="submit" className="button-primary">Adicionar documento</button>
        </div>
      </form>
    </section>
  );
}
