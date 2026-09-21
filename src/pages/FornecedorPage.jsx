import { useParams } from "react-router-dom";

export default function FornecedorPage({ fornecedores, setFornecedores, contratos }) {
  const { id } = useParams();

  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(id));

  return (
    <>
      <h1>Nome: {fornecedor.nome}</h1>
      <ul>
        <li>
            Tipo: {fornecedor.tipo}
        </li>
        <li>
            CNPJ: {fornecedor.cnpj}
        </li>
        <li>
            E-mails: {fornecedor.emails}
        </li>
      </ul>
      <h2>Contratos assinados:</h2>
      
    </>
  );
}
