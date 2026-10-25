import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFornecedorStore } from "../store/useFornecedorStore.js";
import EstadoSelect from "../components/EstadoSelect.jsx";
import MunicipioSelect from "../components/MunicipioSelect.jsx";

const initialFornecedor = {
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

export default function AdicionarFornecedorPage() {
  const navigate = useNavigate();
  const addFornecedor = useFornecedorStore((state) => state.addFornecedor);
  const [novoFornecedor, setNovoFornecedor] = useState(initialFornecedor);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setNovoFornecedor((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!novoFornecedor[field].trim()) {
        newErrors[field] = message;
      }
    });

    if (novoFornecedor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoFornecedor.email)) {
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
      await addFornecedor(novoFornecedor);
      navigate("/fornecedores");
    } catch (error) {
      setErrors({ submit: error.message || "Não foi possível adicionar o fornecedor." });
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Cadastro de fornecedores</p>
          <h1>Novo fornecedor</h1>
          <p>Preencha os dados abaixo para registrar um novo fornecedor no sistema.</p>
        </div>
        <div className="import-action">
          <button type="button" className="button-secondary">
            Importar arquivo
          </button>
          <span>Disponível em breve</span>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Identificação do fornecedor</strong>
          <span>Dados cadastrais e fiscais básicos</span>
        </div>

        <label>
          Tipo
          <select value={novoFornecedor.tipo} onChange={(event) => updateField("tipo", event.target.value)}>
            <option value="" disabled>Selecione o tipo</option>
            <option value="Pessoa Jurídica">Pessoa Jurídica</option>
            <option value="Pessoa Física">Pessoa Física</option>
          </select>
          {errors.tipo && <span className="form-error">{errors.tipo}</span>}
        </label>

        <label>
          Razão social
          <input type="text" value={novoFornecedor.razao_social} onChange={(event) => updateField("razao_social", event.target.value)} />
          {errors.razao_social && <span className="form-error">{errors.razao_social}</span>}
        </label>

        <label>
          Nome fantasia
          <input type="text" value={novoFornecedor.nome_fantasia} onChange={(event) => updateField("nome_fantasia", event.target.value)} />
        </label>

        <label>
          CPF/CNPJ
          <input type="text" value={novoFornecedor.cpf_cnpj} onChange={(event) => updateField("cpf_cnpj", event.target.value)} />
          {errors.cpf_cnpj && <span className="form-error">{errors.cpf_cnpj}</span>}
        </label>

        <label>
          Inscrição estadual
          <input type="text" value={novoFornecedor.inscricao_estadual} onChange={(event) => updateField("inscricao_estadual", event.target.value)} />
        </label>

        <label>
          Inscrição municipal
          <input type="text" value={novoFornecedor.inscricao_municipal} onChange={(event) => updateField("inscricao_municipal", event.target.value)} />
        </label>

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Endereço e contato</strong>
          <span>Localização e canais de comunicação</span>
        </div>

        <label>
          CEP
          <input type="text" value={novoFornecedor.cep} onChange={(event) => updateField("cep", event.target.value)} />
        </label>

        <EstadoSelect
          value={novoFornecedor.estado}
          onChange={(value) => {
            updateField("estado", value);
            updateField("cidade", "");
          }}
          error={errors.estado}
        />

        <MunicipioSelect
          uf={novoFornecedor.estado}
          value={novoFornecedor.cidade}
          onChange={(value) => updateField("cidade", value)}
          error={errors.cidade}
        />

        <label>
          Logradouro
          <input type="text" value={novoFornecedor.logradouro} onChange={(event) => updateField("logradouro", event.target.value)} />
        </label>

        <label>
          Número
          <input type="text" value={novoFornecedor.numero} onChange={(event) => updateField("numero", event.target.value)} />
        </label>

        <label>
          Bairro
          <input type="text" value={novoFornecedor.bairro} onChange={(event) => updateField("bairro", event.target.value)} />
        </label>


        <label>
          E-mail
          <input type="email" value={novoFornecedor.email} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>

        <label>
          Telefone
          <input type="tel" value={novoFornecedor.telefone} onChange={(event) => updateField("telefone", event.target.value)} />
        </label>

        <label>
          Representante legal
          <input type="text" value={novoFornecedor.representante_legal} onChange={(event) => updateField("representante_legal", event.target.value)} />
        </label>

        <label>
          Status
          <select value={novoFornecedor.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="Ativo">Ativo</option>
            <option value="Suspenso">Suspenso</option>
            <option value="Inativo">Inativo</option>
          </select>
          {errors.status && <span className="form-error">{errors.status}</span>}
        </label>

        <div className="form-actions">
          {errors.submit && <span className="form-error">{errors.submit}</span>}
          <button type="submit" className="button-primary">Adicionar fornecedor</button>
        </div>
      </form>
    </section>
  );
}
