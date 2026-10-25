import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentoStore } from "../store/useDocumentoStore.js";
import EstadoSelect from "../components/EstadoSelect.jsx";
import MunicipioSelect from "../components/MunicipioSelect.jsx";

const initialDocumento = {
  nome_documento: "",
  categoria: "",
  esfera: "",
  cidade: "",
  estado: "",
  fonte_website: "",
};

export default function AdicionarDocumentoPage() {
  const navigate = useNavigate();
  const addDocumento = useDocumentoStore((state) => state.addDocumento);
  const [novoDocumento, setNovoDocumento] = useState(initialDocumento);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setNovoDocumento((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!novoDocumento.nome_documento.trim()) {
      newErrors.nome_documento = "Nome do documento é obrigatório.";
    }
    if (!novoDocumento.categoria) {
      newErrors.categoria = "Selecione uma categoria.";
    }
    if (!novoDocumento.esfera) {
      newErrors.esfera = "Selecione a esfera.";
    }
    if (
      novoDocumento.fonte_website &&
      !/^https?:\/\/.+/.test(novoDocumento.fonte_website)
    ) {
      newErrors.fonte_website = "Informe uma URL válida iniciando com http:// ou https://.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await addDocumento(novoDocumento);
      navigate("/documentos");
    } catch (error) {
      setErrors({ submit: error.message || "Não foi possível adicionar o documento." });
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Catálogo documental</p>
          <h1>Novo documento</h1>
          <p>Cadastre uma certidão ou documento exigido pela gestão contratual.</p>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Identificação do documento</strong>
          <span>Informações usadas no catálogo de documentos</span>
        </div>

        <label className="field-wide">
          Nome do documento
          <input
            type="text"
            value={novoDocumento.nome_documento}
            onChange={(event) => updateField("nome_documento", event.target.value)}
          />
          {errors.nome_documento && <span className="form-error">{errors.nome_documento}</span>}
        </label>

        <label>
          Categoria
          <select value={novoDocumento.categoria} onChange={(event) => updateField("categoria", event.target.value)}>
            <option value="" disabled>Selecione a categoria</option>
            <option value="Regularidade Fiscal">Regularidade Fiscal</option>
            <option value="Regularidade Trabalhista">Regularidade Trabalhista</option>
            <option value="Regularidade Previdenciária">Regularidade Previdenciária</option>
            <option value="Qualificação Técnica">Qualificação Técnica</option>
            <option value="Qualificação Econômico-Financeira">Qualificação Econômico-Financeira</option>
            <option value="Outros">Outros</option>
          </select>
          {errors.categoria && <span className="form-error">{errors.categoria}</span>}
        </label>

        <label>
          Esfera
          <select value={novoDocumento.esfera} onChange={(event) => updateField("esfera", event.target.value)}>
            <option value="" disabled>Selecione a esfera</option>
            <option value="Federal">Federal</option>
            <option value="Estadual">Estadual</option>
            <option value="Municipal">Municipal</option>
            <option value="Trabalhista">Trabalhista</option>
          </select>
          {errors.esfera && <span className="form-error">{errors.esfera}</span>}
        </label>

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Localidade e fonte</strong>
          <span>Preencha quando o documento for específico de uma região</span>
        </div>

        <EstadoSelect
          value={novoDocumento.estado}
          onChange={(value) => {
            updateField("estado", value);
            updateField("cidade", "");
          }}
        />

        <MunicipioSelect
          uf={novoDocumento.estado}
          value={novoDocumento.cidade}
          onChange={(value) => updateField("cidade", value)}
        />

        <label className="field-wide">
          Fonte (website)
          <input type="url" placeholder="https://exemplo.gov.br" value={novoDocumento.fonte_website} onChange={(event) => updateField("fonte_website", event.target.value)} />
          {errors.fonte_website && <span className="form-error">{errors.fonte_website}</span>}
        </label>

        <div className="form-actions">
          {errors.submit && <span className="form-error">{errors.submit}</span>}
          <Link to="/documentos">
            <button type="button" className="button-secondary">Cancelar</button>
          </Link>
          <button type="submit" className="button-primary">Adicionar documento</button>
        </div>
      </form>
    </section>
  );
}
