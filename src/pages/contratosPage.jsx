import { useState } from "react";
import TabelaContratos from "../components/TabelaContratos";
import AddContratoForm from "../components/AddContratoForm";

export default function ContratosPage() {

  const [contratos, setContratos] = useState([]);

  return (
    <>
      <AddContratoForm contratos={contratos} setContratos={setContratos} />
      <TabelaContratos contratos={contratos} setContratos={setContratos} />
    </>
  );
}
