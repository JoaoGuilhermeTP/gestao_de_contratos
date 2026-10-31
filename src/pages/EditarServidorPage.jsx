import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useServidorStore } from "../store/useServidorStore.js";

const emptyServidor = {
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

export default function EditarServidorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const servidores = useServidorStore((state) => state.servidores);
  const editarServidor = useServidorStore((state) => state.editarServidor);
  const servidor = servidores.find((item) => item.id === Number(id));
  const [editedState, setEditedState] = useState(null);
  const [errors, setErrors] = useState({});
  const edited = editedState || servidor || emptyServidor;

  if (!servidor) {
    return <Navigate to="/servidores" replace />;
  }

  const updateField = (field, value) => {
    setEditedState((current) => ({ ...(current || servidor), [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!String(edited[field] || "").trim()) {
        newErrors[field] = message;
      }
    });

    if (edited.secretaria_id && (!Number.isInteger(Number(edited.secretaria_id)) || Number(edited.secretaria_id) <= 0)) {
      newErrors.secretaria_id = "Informe um ID de secretaria válido.";
    }

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
      await editarServidor(Number(id), {
        ...edited,
        secretaria_id: Number(edited.secretaria_id),
      });
      navigate(`/servidor/${id}`);
    } catch (error) {
      setErrors({ submit: error.message || "Não foi possível editar o servidor." });
    }
  }

  return (
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Edição de servidor</p>
          <h1>{servidor.nome}</h1>
          <p>Atualize os dados funcionais e de contato deste servidor.</p>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Dados funcionais</strong>
          <span>Identificação e vínculo do servidor</span>
        </div>

        <label>
          ID da secretaria
          <input
            type="number"
            min="1"
            value={edited.secretaria_id || ""}
            onChange={(event) => updateField("secretaria_id", event.target.value)}
          />
          {errors.secretaria_id && <span className="form-error">{errors.secretaria_id}</span>}
        </label>

        <label>
          Nome completo
          <input type="text" value={edited.nome || ""} onChange={(event) => updateField("nome", event.target.value)} />
          {errors.nome && <span className="form-error">{errors.nome}</span>}
        </label>

        <label>
          Registro funcional
          <input type="text" value={edited.registro_funcional || ""} onChange={(event) => updateField("registro_funcional", event.target.value)} />
          {errors.registro_funcional && <span className="form-error">{errors.registro_funcional}</span>}
        </label>

        <label>
          Cargo
          <input type="text" value={edited.cargo || ""} onChange={(event) => updateField("cargo", event.target.value)} />
          {errors.cargo && <span className="form-error">{errors.cargo}</span>}
        </label>

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Contato</strong>
          <span>Canais de comunicação do servidor</span>
        </div>

        <label>
          E-mail
          <input type="email" value={edited.email || ""} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </label>

        <label>
          Telefone
          <input type="tel" value={edited.telefone || ""} onChange={(event) => updateField("telefone", event.target.value)} />
        </label>

        <div className="form-actions">
          {errors.submit && <span className="form-error">{errors.submit}</span>}
          <Link to={`/servidor/${servidor.id}`}>
            <button type="button" className="button-secondary">Cancelar</button>
          </Link>
          <button type="submit" className="button-primary">Salvar alterações</button>
        </div>
      </form>
    </section>
  );
}
