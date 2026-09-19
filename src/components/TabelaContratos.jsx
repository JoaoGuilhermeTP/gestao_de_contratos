import { useState } from "react";

export default function TabelaContratos({ contratos, setContratos }) {
  const [filtros, setFiltros] = useState({
    numero: "",
    ano: "",
    objeto: "",
    fornecedor: "",
    procedimento: "",
    tipo: "",
  });

  const contratosFiltrados = contratos.filter((contrato) => {
    const matchNumero =
      !filtros.numero || String(contrato.numero) === filtros.numero;
    const matchAno = !filtros.ano || String(contrato.ano) === filtros.ano;

    const matchObjeto =
      !filtros.objeto ||
      contrato.objeto.toLowerCase().includes(filtros.objeto.toLowerCase());

    const matchFornecedor =
      !filtros.fornecedor ||
      contrato.fornecedor
        .toLowerCase()
        .includes(filtros.fornecedor.toLowerCase());

    const matchProcedimento =
      !filtros.procedimento ||
      contrato.procedimento
        .toLowerCase()
        .includes(filtros.procedimento.toLowerCase());

    const matchTipo =
      !filtros.tipo ||
      contrato.tipo.toLowerCase().includes(filtros.tipo.toLowerCase());

    // Only keep the contract if ALL active filters match
    return (
      matchNumero &&
      matchAno &&
      matchObjeto &&
      matchFornecedor &&
      matchProcedimento &&
      matchTipo
    );
  });

  function deletarContrato(id) {
    setContratos((contratosAtuais) =>
      contratosAtuais.filter((contrato) => contrato.id !== id),
    );
  }

  return (
    <>
      <h2>Contratos cadastrados</h2>
      {contratos.length > 0 ? (
        <>
          <h2>Filtrar contratos</h2>
          <input
            type="number"
            placeholder="Número"
            value={filtros.numero || ""}
            onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
          />
          <input
            type="number"
            placeholder="Ano"
            value={filtros.ano || ""}
            onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
          />
          <input
            type="text"
            placeholder="Objeto"
            value={filtros.objeto || ""}
            onChange={(e) => setFiltros({ ...filtros, objeto: e.target.value })}
          />
          <input
            type="text"
            placeholder="fornecedor"
            value={filtros.fornecedor || ""}
            onChange={(e) =>
              setFiltros({ ...filtros, fornecedor: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="procedimento"
            value={filtros.procedimento || ""}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                procedimento: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="tipo"
            value={filtros.tipo || ""}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
          />
          <table>
            <tbody>
              <tr>
                <th>Número/Ano</th>
                <th>Objeto</th>
                <th>Fornecedor</th>
                <th>Procedimento</th>
                <th>Tipo</th>
                <th>Data da assinatura</th>
                <th>Data de término</th>
              </tr>
              {contratosFiltrados.map((contrato) => (
                <tr key={contrato.id}>
                  <td>
                    {contrato.numero}/{contrato.ano}
                  </td>
                  <td>{contrato.objeto}</td>
                  <td>{contrato.fornecedor}</td>
                  <td>{contrato.procedimento}</td>
                  <td>{contrato.tipo}</td>
                  <td>{contrato.dataDaAssinatura}</td>
                  <td>{contrato.dataDeTermino}</td>
                  <td>
                    <button onClick={() => deletarContrato(contrato.id)}>
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Nenhum contrato cadastrato</p>
      )}
    </>
  );
}
