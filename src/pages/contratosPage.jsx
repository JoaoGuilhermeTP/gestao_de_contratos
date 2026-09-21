import { useState } from "react";
import TabelaContratos from "../components/TabelaContratos";
import AddContratoForm from "../components/AddContratoForm";
import { mockFornecedores } from "../mock/mockFornecedores";

export default function ContratosPage({contratos, setContratos}) {

  const [fornecedores, setFornecedores] = useState(mockFornecedores);

  return (
    <>
    <h1>Contratos</h1>
      <AddContratoForm contratos={contratos} setContratos={setContratos} fornecedores={fornecedores}/>
      <TabelaContratos contratos={contratos} setContratos={setContratos} fornecedores={fornecedores} />
    </>
  );
}
