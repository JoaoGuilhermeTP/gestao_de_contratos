import { useState } from "react";
import { Link } from "react-router-dom";
import { useContratoStore } from "../../store/useContratoStore";
import { useFornecedorStore } from "../../store/useFornecedorStore";
import { useAtaStore } from "../../store/useAtaStore";
import { formatDate, formatCurrency } from "../../helper_functions/helper";

export default function TabelaAtas({ fornecedorId }) {
  const todasAsAtas = useAtaStore((state) => state.atas);
  const fornecedores = useFornecedorStore((state) => state.fornecedores);

  const atas = fornecedorId ? todasAsAtas.filter((ata) => ata.fornecedor_id === Number(fornecedorId)) : todasAsAtas;

  //   const [filtros, setFiltros] = useState({
  //     numero: "",
  //     ano: "",
  //     objeto: "",
  //     fornecedor_id: "",
  //     procedimento: "",
  //     status: "",
  //   });

  //   const contratosFiltrados = contratos.filter((contrato) => {
  //     const matchNumero = !filtros.numero || String(contrato.numero) === filtros.numero;
  //     const matchAno = !filtros.ano || String(contrato.ano) === filtros.ano;
  //     const matchObjeto = !filtros.objeto || contrato.objeto.toLowerCase().includes(filtros.objeto.toLowerCase());
  //     const matchFornecedor = !filtros.fornecedor_id || Number(contrato.fornecedor_id) === Number(filtros.fornecedor_id);
  //     const matchProcedimento = !filtros.procedimento || contrato.procedimento.toLowerCase().includes(filtros.procedimento.toLowerCase());
  //     const matchStatus = !filtros.status || contrato.status.toLowerCase().includes(filtros.status.toLowerCase());
  //     // Only keep the contract if ALL active filters match
  //     return matchNumero && matchAno && matchObjeto && matchFornecedor && matchProcedimento && matchStatus;
  //   });

  return (
    <section className="data-section">
      <h2>Atas de registro de preços cadastrados</h2>
      {atas.length > 0 ? (
        <>
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
                  <th>Assinatura</th>
                  <th>Término</th>
                </tr>
              </thead>
              <tbody>
                {atas.map((ata) => (
                  <tr key={ata.id}>
                    <td>
                      {/* <Link to={`/contratos/${contrato.id}`}> */}
                        {ata.numero}/{ata.ano}
                      {/* </Link> */}
                    </td>
                    <td className="contract-text-cell">{ata.objeto}</td>
                    <td className="contract-text-cell">
                      <Link to={`/fornecedor/${ata.fornecedor_id}`}>{fornecedores.find((fornecedor) => fornecedor.id === ata.fornecedor_id).razao_social}</Link>
                    </td>
                    <td className="contract-text-cell">{ata.procedimento_id}</td>
                    <td className="contract-text-cell">{ata.status}</td>
                    <td>{formatCurrency(ata.valor_global)}</td>
                    <td>{formatDate(ata.data_de_assinatura)}</td>
                    <td>{formatDate(ata.data_de_termino)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Nenhuma ata cadastrata</p>
      )}
    </section>
  );
}
