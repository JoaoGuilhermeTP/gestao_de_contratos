import TabelaAtas from "./TabelaAtas";
import { Link } from "react-router-dom";
import { useAtaStore } from "../../store/useAtaStore";

export default function AtasPage() {

  const atas = useAtaStore((state) => state.atas);

  return (
    <section className="listing-page">
      <header className="listing-header">
        <div>
          <p className="eyebrow">Gestão de Atas</p>
          <div className="listing-title-row">
            <h1>Atas de Registro de Preços</h1>
            <span className="record-count">{atas.length} registros</span>
          </div>
          <p>Consulte, filtre e acompanhe as atas de registro de preços cadastrados no sistema.</p>
        </div>
        {/* <Link className="button-primary listing-action" to="/adicionar_contrato">
          Adicionar Ata
        </Link> */}
      </header>
      <TabelaAtas />
    </section>
  );
}