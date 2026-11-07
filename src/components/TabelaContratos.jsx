import { useState } from "react";
import { Link } from "react-router-dom";
import { useContratoStore } from "../store/useContratoStore";
import { useFornecedorStore } from "../store/useFornecedorStore";
import { formatDate, formatCurrency } from "../helper_functions/helper";

export default function TabelaContratos({ fornecedorId }) {
  const todosContratos = useContratoStore((state) => state.contratos);
  const fornecedores = useFornecedorStore((state) => state.fornecedores);
  const deletarContrato = useContratoStore((state) => state.deletarContrato);

  const contratos = fornecedorId ? todosContratos.filter((contrato) => contrato.fornecedor_id === Number(fornecedorId)) : todosContratos;

  const [filtros, setFiltros] = useState({
    numero: "",
    ano: "",
    objeto: "",
    fornecedor_id: "",
    procedimento: "",
    status: "",
  });

  const contratosFiltrados = contratos.filter((contrato) => {
    const matchNumero = !filtros.numero || String(contrato.numero) === filtros.numero;
    const matchAno = !filtros.ano || String(contrato.ano) === filtros.ano;
    const matchObjeto = !filtros.objeto || contrato.objeto.toLowerCase().includes(filtros.objeto.toLowerCase());
    const matchFornecedor = !filtros.fornecedor_id || Number(contrato.fornecedor_id) === Number(filtros.fornecedor_id);
    const matchProcedimento = !filtros.procedimento || contrato.procedimento.toLowerCase().includes(filtros.procedimento.toLowerCase());
    const matchStatus = !filtros.status || contrato.status.toLowerCase().includes(filtros.status.toLowerCase());
    // Only keep the contract if ALL active filters match
    return matchNumero && matchAno && matchObjeto && matchFornecedor && matchProcedimento && matchStatus;
  });

  return (
    <section className="data-section">
      <h2>Contratos cadastrados</h2>
      {contratos.length > 0 ? (
        <>
          <div className="filter-panel">
            <h3>Filtrar contratos</h3>
            <div className="filter-grid">
              <input type="number" placeholder="Número" value={filtros.numero || ""} onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })} />
              <input type="number" placeholder="Ano" value={filtros.ano || ""} onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })} />
              <input type="text" placeholder="Objeto" value={filtros.objeto || ""} onChange={(e) => setFiltros({ ...filtros, objeto: e.target.value })} />
              <select
                value={filtros.fornecedor_id}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    fornecedor_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Selecione um fornecedor</option>

                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.razao_social} - {fornecedor.cpf_cnpj}
                  </option>
                ))}
              </select>
              {/* <input
                type="text"
                placeholder="Procedimento"
                value={filtros.procedimento || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    procedimento: e.target.value,
                  })
                }
              /> */}


              {/* <select
                value={filtros.procedimento_id}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    procedimento_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Selecione um procedimento</option>

                {procedimentos.map((procedimento) => (
                  <option key={procedimento.id} value={procedimento.name}>
                    {procedimento.name}
                  </option>
                ))}
              </select> */}


              <input type="text" placeholder="Status" value={filtros.status || ""} onChange={(e) => setFiltros({ ...filtros, status: e.target.value })} />
            </div>
          </div>
          <div className="table-scroll">
            <table className="contract-table">
              <thead>
                <tr>
                  <th>Número/Ano</th>
                  <th>Objeto</th>
                  <th>Fornecedor</th>
                  <th>Procedimento</th>
                  <th>Status</th>
                  <th>Valor Global</th>
                  <th>Prorrogável</th>
                  <th>Assinatura</th>
                  <th>Término</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contratosFiltrados.map((contrato) => (
                  <tr key={contrato.id}>
                    <td>
                      <Link to={`/contratos/${contrato.id}`}>{contrato.numero}/{contrato.ano}</Link>
                    </td>
                    <td className="contract-text-cell">{contrato.objeto}</td>
                    <td className="contract-text-cell">
                      <Link to={`/fornecedor/${contrato.fornecedor_id}`}>{fornecedores.find((fornecedor) => fornecedor.id === contrato.fornecedor_id).razao_social}</Link>
                    </td>
                    <td className="contract-text-cell">{contrato.procedimento_id}</td>
                    <td className="contract-text-cell">{contrato.status}</td>
                    <td>{formatCurrency(contrato.valor_global)}</td>
                    <td>{contrato.prorrogavel === 1 ? "Sim" : "Não"}</td>
                    <td>{formatDate(contrato.data_de_assinatura)}</td>
                    <td>{formatDate(contrato.data_de_termino)}</td>
                    <td>
                      <button onClick={() => deletarContrato(contrato.id)}>Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Nenhum contrato cadastrato</p>
      )}
    </section>
  );
}
