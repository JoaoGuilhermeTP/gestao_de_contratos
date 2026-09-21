import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Contrato({ contratos, setContratos, fornecedores }) {
  const { id } = useParams();

  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const fornecedor = fornecedores.find(
    (fornecedor) => fornecedor.id === Number(contrato.fornecedor_id),
  );

  return (
    <>
      <h1>Contrato nº. {contrato.numero}</h1>
      <ul>
        <li>Objeto: {contrato.objeto}</li>
        <li>
          <Link to={`/fornecedor/${fornecedor.id}`}>
            Fornecedor: {fornecedor.nome}
          </Link>
        </li>
        <li>Procedimento: {contrato.procedimento}</li>
      </ul>
    </>
  );
}
