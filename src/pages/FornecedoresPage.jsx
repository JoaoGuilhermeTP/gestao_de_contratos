import TabelaFornecedores from "../components/TabelaFornecedores";
import { Link } from "react-router-dom";
import { useContractStore } from "../store/useContractStore.js";

export default function FornecedoresPage() {

  const fornecedores = useContractStore((state) => state.fornecedores);

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
      <TabelaFornecedores />
    </section>
  );
}