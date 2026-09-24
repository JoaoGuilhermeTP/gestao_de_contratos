import { useState } from "react";
import { Link } from "react-router-dom";

export default function TabelaFornecedores({ fornecedores, setFornecedores, contratos }) {
  const [filtros, setFiltros] = useState({
    tipo: "",
    razao_social: "",
    nome_fantasia: "",
    cpf_cnpj: "",
    cidade: "",
    estado: "",
    representante_legal: "",
    status: "",
  });

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const matchTipo = !filtros.tipo || String(fornecedor.tipo) === filtros.tipo;
    const matchRazaoSocial = !filtros.razao_social || fornecedor.razao_social.toLowerCase().includes(filtros.razao_social.toLowerCase());
    const matchNomeFantasia = !filtros.nome_fantasia || fornecedor.nome_fantasia.toLowerCase().includes(filtros.nome_fantasia.toLowerCase());
    const matchCpfCnpj = !filtros.cpf_cnpj || fornecedor.cpf_cnpj.toLowerCase().includes(filtros.cpf_cnpj.toLowerCase());
    const matchCidade = !filtros.cidade || fornecedor.cidade.toLowerCase().includes(filtros.cidade.toLowerCase());
    const matchEstado = !filtros.estado || String(fornecedor.estado) === filtros.estado;
    const matchRepresentante = !filtros.representante_legal || fornecedor.representante_legal.toLowerCase().includes(filtros.representante_legal.toLowerCase());
    const matchStatus = !filtros.status || String(fornecedor.status) === filtros.status;
    // Only keep the contract if ALL active filters match
    return matchTipo && matchRazaoSocial && matchNomeFantasia && matchCpfCnpj && matchCidade && matchEstado && matchRepresentante && matchStatus;
  });

  function deletarFornecedor(id) {
    setFornecedor((fornecedoresAtuais) => fornecedoresAtuais.filter((fornecedor) => fornecedor.id !== id));
  }

  return (
    <>
      <h2>Fornecedores cadastrados</h2>
      {fornecedores.length > 0 ? (
        <>
          <h3>Filtrar fornecedores</h3>
          <input type="text" placeholder="Tipo" value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })} />
          <input type="text" placeholder="Razão Social" value={filtros.razao_social} onChange={(e) => setFiltros({ ...filtros, razao_social: e.target.value })} />
          <input type="text" placeholder="Nome Fantasia" value={filtros.nome_fantasia} onChange={(e) => setFiltros({ ...filtros, nome_fantasia: e.target.value })} />
          <input type="text" placeholder="CPF ou CNPJ" value={filtros.cpf_cnpj} onChange={(e) => setFiltros({ ...filtros, cpf_cnpj: e.target.value })} />
          <input type="text" placeholder="Cidade" value={filtros.cidade} onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })} />
          <input type="text" placeholder="Estado" value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} />
          <input type="text" placeholder="Representante" value={filtros.representante_legal} onChange={(e) => setFiltros({ ...filtros, representante: e.target.value })} />
          <input type="text" placeholder="Status" value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.target.value })} />

          <table>
            <tbody>
              <tr>
                <th>Tipo</th>
                <th>Razão Social</th>
                <th>Nome Fantasia</th>
                <th>CPF/CNPJ</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Representante</th>
                <th>Status</th>
              </tr>
              {fornecedoresFiltrados.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td>{fornecedor.tipo}</td>
                  <td>
                    <Link to={`/fornecedor/${fornecedor.id}`}>{fornecedor.razao_social}</Link>
                  </td>
                  <td>{fornecedor.nome_fantasia}</td>
                  <td>{fornecedor.cpf_cnpj}</td>
                  <td>{fornecedor.cidade}</td>
                  <td>{fornecedor.estado}</td>
                  <td>{fornecedor.representante_legal}</td>
                  <td>{fornecedor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Nenhum fornecedor cadastrato</p>
      )}
    </>
  );
}
