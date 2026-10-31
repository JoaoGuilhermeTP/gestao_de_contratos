import { Link, Navigate, useParams } from "react-router-dom";
import { useServidorStore } from "../store/useServidorStore.js";

export default function ServidorPage() {
  const { id } = useParams();
  const servidores = useServidorStore((state) => state.servidores);
  const servidor = servidores.find((item) => item.id === Number(id));

  if (!servidor) {
    return <Navigate to="/servidores" replace />;
  }

  return (
    <section className="detail-page">
      <header className="detail-header">
        <div>
          <p className="eyebrow">Cadastro de servidor</p>
          <h1>{servidor.nome}</h1>
          <p className="detail-subtitle">Dados funcionais e informações de contato deste servidor.</p>
        </div>
        <span className="detail-header-actions">
          <Link to={`/servidor/editar/${servidor.id}`}>
            <button type="button" className="button-primary">Editar servidor</button>
          </Link>
          <Link to="/servidores">
            <button type="button" className="button-secondary">Voltar para servidores</button>
          </Link>
        </span>
      </header>

      <div className="detail-card">
        <div className="detail-card-heading">
          <h2>Dados funcionais</h2>
        </div>
        <dl className="detail-grid">
          <div>
            <dt>Nome completo</dt>
            <dd>{servidor.nome}</dd>
          </div>
          <div>
            <dt>Registro funcional</dt>
            <dd>{servidor.registro_funcional}</dd>
          </div>
          <div>
            <dt>Cargo</dt>
            <dd>{servidor.cargo}</dd>
          </div>
          <div>
            <dt>Secretaria</dt>
            <dd>{servidor.secretaria_id}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{servidor.email || "Não informado"}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{servidor.telefone || "Não informado"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
