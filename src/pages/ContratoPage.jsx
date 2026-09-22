import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ContratoPage({
  contratos,
  setContratos,
  fornecedores,
}) {
  const { id } = useParams();
  const contrato = contratos.find((contrato) => contrato.id === Number(id));
  const fornecedor = fornecedores.find(
    (fornecedor) => fornecedor.id === Number(contrato.fornecedor_id),
  );

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <>
        <p>Funcionalidade a ser implementada</p>
        <button onClick={() => setIsEditing(false)}>Cancelar edição</button>
      </>
    );
  } else {
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
        <button onClick={() => setIsEditing(true)}>Editar contrato</button>
      </>
    );
  }
}
