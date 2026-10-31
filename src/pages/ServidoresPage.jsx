import TabelaServidores from "../components/TabelaServidores";
import { Link } from "react-router-dom";
import { useServidorStore } from "../store/useServidorStore.js";

export default function ServidoresPage() {

  const servidores = useServidorStore((state) => state.servidores);

  return (
    <section className="listing-page">
      <header className="listing-header">
        <div>
          <p className="eyebrow">Base de servidores</p>
          <div className="listing-title-row">
            <h1>Servidores</h1>
            <span className="record-count">{servidores.length} registros</span>
          </div>
          <p>Servidores cadastrados no sistema.</p>
        </div>
        <Link className="button-primary listing-action" to="/adicionar_servidor">
          Adicionar servidor
        </Link>
      </header>
      <TabelaServidores />
    </section>
  );
}