import TabelaContratos from "../components/TabelaContratos";
import { Link } from "react-router-dom";

export default function ContratosPage({
  contratos,
  setContratos,
  fornecedores,
  setFornecedores,
}) {
  return (
    <section className="listing-page">
      <header className="listing-header">
        <div>
          <p className="eyebrow">Gestão contratual</p>
          <div className="listing-title-row">
            <h1>Contratos</h1>
            <span className="record-count">{contratos.length} registros</span>
          </div>
          <p>Consulte, filtre e acompanhe os contratos cadastrados no sistema.</p>
        </div>
        <Link className="button-primary listing-action" to="/adicionar_contrato">
          Adicionar contrato
        </Link>
      </header>
      <TabelaContratos
        contratos={contratos}
        setContratos={setContratos}
        fornecedores={fornecedores}
      />
    </section>
  );
}