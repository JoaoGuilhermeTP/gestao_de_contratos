import { useState } from "react";

export default function AddContratoForm({
  contratos,
  setContratos,
  fornecedores,
  setFornecedores,
}) {
  const initialContrato = {
    numero: "",
    ano: "",
    objeto: "",
    fornecedor_id: "",
    procedimento: "",
    tipo: "",
    dataDaAssinatura: "",
    dataDeTermino: "",
  };

  const [novoContrato, setNovoContrato] = useState(initialContrato);

  function handleSubmit(e) {
    e.preventDefault();
    if (novoContrato.numero && novoContrato.ano && novoContrato.objeto) {
      const contrato = { ...novoContrato, id: Date.now() };
      setContratos([...contratos, contrato]);
      setNovoContrato(initialContrato);
    }
  }

  return (
    <>
      <h2>Adicionar novo contrato</h2>
      <button>Importar arquivo</button>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Número"
          value={novoContrato.numero}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, numero: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Ano"
          value={novoContrato.ano}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, ano: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Objeto"
          value={novoContrato.objeto}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, objeto: e.target.value })
          }
        />
        <select
          value={novoContrato.fornecedor_id}
          onChange={(e) =>
            setNovoContrato({
              ...novoContrato,
              fornecedor_id: Number(e.target.value),
            })
          }
        >
          <option value="" disabled>
            Selecione um fornecedor
          </option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome} - {fornecedor.cnpj}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="procedimento"
          value={novoContrato.procedimento}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, procedimento: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="tipo"
          value={novoContrato.tipo}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, tipo: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Data de assinatura"
          value={novoContrato.dataDaAssinatura}
          onChange={(e) =>
            setNovoContrato({
              ...novoContrato,
              dataDaAssinatura: e.target.value,
            })
          }
        />
        <input
          type="date"
          placeholder="Data de término"
          value={novoContrato.dataDeTermino}
          onChange={(e) =>
            setNovoContrato({ ...novoContrato, dataDeTermino: e.target.value })
          }
        />
        <button>Adicionar</button>
      </form>
    </>
  );
}
