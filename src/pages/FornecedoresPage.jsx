import TabelaFornecedores from "../components/TabelaFornecedores";
import { Link } from "react-router-dom";

export default function FornecedoresPage({
  fornecedores,
  setFornecedores,
}) {
  return (
    <section className="listing-page">
      <header className="listing-header">
        <div>
          <p className="eyebrow">Base de fornecedores</p>
          <div className="listing-title-row">
            <h1>Fornecedores</h1>
            <span className="record-count">{fornecedores.length} registros</span>
          </div>
          <p>Encontre rapidamente empresas e responsáveis vinculados à gestão contratual.</p>
        </div>
      </header>
      <TabelaFornecedores
        fornecedores={fornecedores}
        setFornecedores={setFornecedores}
      />
    </section>
  );
}