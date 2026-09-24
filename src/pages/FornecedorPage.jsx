import { useParams } from "react-router-dom";
import TabelaContratos from "../components/TabelaContratos";

export default function FornecedorPage({ fornecedores, setFornecedores, contratos, setContratos }) {
  const { id } = useParams();

  const fornecedor = fornecedores.find((fornecedor) => fornecedor.id === Number(id));

  return (
    <>
      <h1>Nome: {fornecedor.razao_social}</h1>
      <ul>
        <li>
            Tipo: {fornecedor.tipo}
        </li>
        <li>
            CNPJ: {fornecedor.cpf_cnpj}
        </li>
        <li>
            E-mails: {fornecedor.email}
        </li>
        <li>
            Telefones: {fornecedor.telefone}
        </li>
        <li>
            Cidade: {fornecedor.cidade}/{fornecedor.estado}
        </li>
      </ul>
      <TabelaContratos contratos={contratos.filter((contrato) => contrato.fornecedor_id === Number(id))} setContratos={setContratos} fornecedores={fornecedores} />
    </>
  );
}
