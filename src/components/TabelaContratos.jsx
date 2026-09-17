export default function TabelaContratos({ contratos, setContratos }) {

  function deletarContrato(id) {
    setContratos((contratosAtuais) =>
      contratosAtuais.filter((contrato) => contrato.id !== id),
    );
  }

  return (
    <>
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
          {contratos.map((contrato) => (
            <tr key={contrato.id}>
              <td>{contrato.numero}/{contrato.ano}</td>
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
  );
}
