import { useParams } from "react-router-dom";

export default function Contrato({ contratos, setContratos }) {
  const { id } = useParams();

  const contrato = contratos.find((contrato) => contrato.id === Number(id));

  return (
    <>
      <h1>Contrato nº. {contrato.numero}</h1>
      <ul>
        <li>
            Objeto: {contrato.objeto}
        </li>
        <li>
            Fornecedor: {contrato.fornecedor}
        </li>
        <li>
            Procedimento: {contrato.procedimento}
        </li>
      </ul>
    </>
  );
}
