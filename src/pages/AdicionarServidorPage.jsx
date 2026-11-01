import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServidorStore } from "../store/useServidorStore.js";
import { useSecretariaStore } from "../store/useSecretariaStore.js";

const initialServidor = {
  secretaria_id: "",
  nome: "",
  registro_funcional: "",
  cargo: "",
  email: "",
  telefone: "",
};

const requiredFields = {
  secretaria_id: "Secretaria é obrigatória.",
  nome: "Nome é obrigatório.",
  registro_funcional: "Registro funcional é obrigatório.",
  cargo: "Cargo é obrigatório.",
};

export default function AdicionarServidorPage() {
  const navigate = useNavigate();
  const addServidor = useServidorStore((state) => state.addServidor);
  const secretarias = useSecretariaStore((state) => state.secretarias);
  const [novoServidor, setNovoServidor] = useState(initialServidor);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setNovoServidor((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!String(novoServidor[field]).trim()) {
        newErrors[field] = message;
      }
    });

    if (novoServidor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoServidor.email)) {
      newErrors.email = "Informe um e-mail válido.";
    }

    if (novoServidor.secretaria_id && (!Number.isInteger(Number(novoServidor.secretaria_id)) || Number(novoServidor.secretaria_id) <= 0)) {
      newErrors.secretaria_id = "Informe um ID de secretaria válido.";
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
      await addServidor({
        ...novoServidor,
        secretaria_id: Number(novoServidor.secretaria_id),
      });
      navigate("/servidores");
    } catch (error) {
      setErrors({ submit: error.message || "Não foi possível adicionar o servidor." });
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Cadastro de servidores</p>
          <h1>Novo servidor</h1>
          <p>Preencha os dados abaixo para registrar um novo servidor no sistema.</p>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Dados funcionais</strong>
          <span>Identificação e vínculo do servidor</span>
        </div>

        <label>
          Secretaria do servidor
          <select
            value={novoServidor.secretaria_id}
            onChange={(e) =>
              setNovoServidor({
                ...novoServidor,
                secretaria_id: Number(e.target.value),
              })
            }
          >
            <option value="" disabled>
              Selecione uma secretaria
            </option>

            {secretarias.map((secretaria) => (
              <option key={secretaria.id} value={secretaria.id}>
                {secretaria.sigla_secretaria} - {secretaria.nome_secretaria}
              </option>
            ))}
          </select>
          {errors.secretaria_id && <span className="form-error">{errors.secretaria_id}</span>}
        </label>

        <label>
          Nome completo
          <input type="text" value={novoServidor.nome} onChange={(event) => updateField("nome", event.target.value)} />
          {errors.nome && <span className="form-error">{errors.nome}</span>}
        </label>

        <label>
          Registro funcional
          <input type="text" value={novoServidor.registro_funcional} onChange={(event) => updateField("registro_funcional", event.target.value)} />
          {errors.registro_funcional && <span className="form-error">{errors.registro_funcional}</span>}
        </label>

        <label>
          Cargo
          <input type="text" value={novoServidor.cargo} onChange={(event) => updateField("cargo", event.target.value)} />
          {errors.cargo && <span className="form-error">{errors.cargo}</span>}
        </label>

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Contato</strong>
          <span>Canais de comunicação do servidor</span>
        </div>

        <label>
          E-mail
          <input type="email" value={novoServidor.email} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>

        <label>
          Telefone
          <input type="tel" value={novoServidor.telefone} onChange={(event) => updateField("telefone", event.target.value)} />
        </label>

        <div className="form-actions">
          {errors.submit && <span className="form-error">{errors.submit}</span>}
          <button type="submit" className="button-primary">Adicionar servidor</button>
        </div>
      </form>
    </section>
  );
}
