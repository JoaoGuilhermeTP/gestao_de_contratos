import TabelaFornecedores from "../components/TabelaFornecedores";
import { Link } from "react-router-dom";

export default function FornecedoresPage({
  fornecedores,
  setFornecedores,
}) {
  return (
    <>
      <h1>Fornecedores</h1>
      {/* <Link to="/adicionar_fornecedor">Adicionar Contrato</Link> */}
      <TabelaFornecedores
        fornecedores={fornecedores}
        setFornecedores={setFornecedores}
      />
    </>
  );
}