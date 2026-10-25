import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useFornecedorStore } from "../store/useFornecedorStore.js";
import EstadoSelect from "../components/EstadoSelect.jsx";
import MunicipioSelect from "../components/MunicipioSelect.jsx";

const emptyFornecedor = {
  tipo: "",
  razao_social: "",
  nome_fantasia: "",
  cpf_cnpj: "",
  inscricao_estadual: "",
  inscricao_municipal: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  email: "",
  telefone: "",
  representante_legal: "",
  status: "Ativo",
};

const requiredFields = {
  tipo: "Selecione o tipo do fornecedor.",
  razao_social: "Razão social é obrigatória.",
  cpf_cnpj: "CPF/CNPJ é obrigatório.",
  cidade: "Cidade é obrigatória.",
  estado: "Estado é obrigatório.",
  status: "Status é obrigatório.",
};

export default function EditarFornecedorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fornecedores = useFornecedorStore((state) => state.fornecedores);
  const editarFornecedor = useFornecedorStore((state) => state.editarFornecedor);
  const fornecedor = fornecedores.find((item) => item.id === Number(id));
  const [editedState, setEditedState] = useState(null);
  const [errors, setErrors] = useState({});
  const edited = editedState || fornecedor || emptyFornecedor;

  if (!fornecedor) {
    return <Navigate to="/fornecedores" replace />;
  }

  const updateField = (field, value) => {
    setEditedState((current) => ({ ...(current || fornecedor), [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!String(edited[field] || "").trim()) {
        newErrors[field] = message;
      }
    });

    if (edited.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(edited.email)) {
      newErrors.email = "Informe um e-mail válido.";
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
      await editarFornecedor(Number(id), edited);
      navigate(`/fornecedor/${id}`);
    } catch (error) {
      setErrors({ submit: error.message || "Não foi possível editar o fornecedor." });
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Edição de fornecedor</p>
          <h1>{fornecedor.razao_social}</h1>
          <p>Atualize os dados cadastrais e fiscais deste fornecedor.</p>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Identificação do fornecedor</strong>
          <span>Dados cadastrais e fiscais básicos</span>
        </div>

        <label>
          Tipo
          <select value={edited.tipo || ""} onChange={(event) => updateField("tipo", event.target.value)}>
            <option value="" disabled>Selecione o tipo</option>
            <option value="Pessoa Jurídica">Pessoa Jurídica</option>
            <option value="Pessoa Física">Pessoa Física</option>
          </select>
          {errors.tipo && <span className="form-error">{errors.tipo}</span>}
        </label>

        <label>
          Razão social
          <input type="text" value={edited.razao_social || ""} onChange={(event) => updateField("razao_social", event.target.value)} />
          {errors.razao_social && <span className="form-error">{errors.razao_social}</span>}
        </label>

        <label>
          Nome fantasia
          <input type="text" value={edited.nome_fantasia || ""} onChange={(event) => updateField("nome_fantasia", event.target.value)} />
        </label>

        <label>
          CPF/CNPJ
          <input type="text" value={edited.cpf_cnpj || ""} onChange={(event) => updateField("cpf_cnpj", event.target.value)} />
          {errors.cpf_cnpj && <span className="form-error">{errors.cpf_cnpj}</span>}
        </label>

        <label>
          Inscrição estadual
          <input type="text" value={edited.inscricao_estadual || ""} onChange={(event) => updateField("inscricao_estadual", event.target.value)} />
        </label>

        <label>
          Inscrição municipal
          <input type="text" value={edited.inscricao_municipal || ""} onChange={(event) => updateField("inscricao_municipal", event.target.value)} />
        </label>

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Endereço e contato</strong>
          <span>Localização e canais de comunicação</span>
        </div>

        <label>
          CEP
          <input type="text" value={edited.cep || ""} onChange={(event) => updateField("cep", event.target.value)} />
        </label>

        <label>
          Logradouro
          <input type="text" value={edited.logradouro || ""} onChange={(event) => updateField("logradouro", event.target.value)} />
        </label>

        <label>
          Número
          <input type="text" value={edited.numero || ""} onChange={(event) => updateField("numero", event.target.value)} />
        </label>

        <label>
          Bairro
          <input type="text" value={edited.bairro || ""} onChange={(event) => updateField("bairro", event.target.value)} />
        </label>

        <MunicipioSelect
          uf={edited.estado || ""}
          value={edited.cidade || ""}
          onChange={(value) => updateField("cidade", value)}
          error={errors.cidade}
        />

        <EstadoSelect
          value={edited.estado || ""}
          onChange={(value) => {
            updateField("estado", value);
            updateField("cidade", "");
          }}
          error={errors.estado}
        />

        <label>
          E-mail
          <input type="email" value={edited.email || ""} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>

        <label>
          Telefone
          <input type="tel" value={edited.telefone || ""} onChange={(event) => updateField("telefone", event.target.value)} />
        </label>

        <label>
          Representante legal
          <input type="text" value={edited.representante_legal || ""} onChange={(event) => updateField("representante_legal", event.target.value)} />
        </label>

        <label>
          Status
          <select value={edited.status || ""} onChange={(event) => updateField("status", event.target.value)}>
            <option value="Ativo">Ativo</option>
            <option value="Suspenso">Suspenso</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.status && <span className="form-error">{errors.status}</span>}
        </label>

        <div className="form-actions">
          {errors.submit && <span className="form-error">{errors.submit}</span>}
          <Link to={`/fornecedor/${fornecedor.id}`}>
            <button type="button" className="button-secondary">Cancelar</button>
          </Link>
          <button type="submit" className="button-primary">Salvar alterações</button>
        </div>
      </form>
    </section>
  );
}
