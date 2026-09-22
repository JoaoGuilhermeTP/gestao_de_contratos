import TabelaContratos from "../components/TabelaContratos";
import { Link } from "react-router-dom";

export default function ContratosPage({
  contratos,
  setContratos,
  fornecedores,
  setFornecedores,
}) {
  return (
    <>
      <h1>Contratos</h1>
      <Link to="/adicionar_contrato">Adicionar Contrato</Link>
      <TabelaContratos
        contratos={contratos}
        setContratos={setContratos}
        fornecedores={fornecedores}
      />
    </>
  );
}
