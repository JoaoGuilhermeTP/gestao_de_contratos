import { useState } from "react";
import TabelaContratos from "../components/TabelaContratos";
import AddContratoForm from "../components/AddContratoForm";

export default function ContratosPage({contratos, setContratos, fornecedores, setFornecedores}) {

  

  return (
    <>
    <h1>Contratos</h1>
      <AddContratoForm contratos={contratos} setContratos={setContratos} fornecedores={fornecedores}/>
      <TabelaContratos contratos={contratos} setContratos={setContratos} fornecedores={fornecedores} />
    </>
  );
}
