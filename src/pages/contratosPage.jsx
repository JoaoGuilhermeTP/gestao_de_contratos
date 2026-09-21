import { useState } from "react";
import TabelaContratos from "../components/TabelaContratos";
import AddContratoForm from "../components/AddContratoForm";
import { mockContratos } from "../mock/mockContratos";

export default function ContratosPage({contratos, setContratos}) {

  return (
    <>
    <h1>Contratos</h1>
      <AddContratoForm contratos={contratos} setContratos={setContratos} />
      <TabelaContratos contratos={contratos} setContratos={setContratos} />
    </>
  );
}
