import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddContratoForm({ contratos, setContratos, fornecedores }) {
  // Navigate hook to navigate to main contratos page after adding new contract
  const navigate = useNavigate();

  // Initial state for contrato
  const initialContrato = {
    ata_id: "",
    numero: "",
    ano: "",
    objeto: "",
    fornecedor_id: "",
    procedimento_id: "",
    status: "",
    valor_global: "",
    prorrogavel: "",
    data_de_assinatura: "",
    data_de_termino: "",
  };

  // State variables
  const [novoContrato, setNovoContrato] = useState(initialContrato);
  const [errors, setErrors] = useState({});

  // Function for validating form
  const validateForm = () => {
    const newErrors = {};

    // Check contract number
    if (!novoContrato.numero) {
      newErrors.numero = "Informe o número do contrato";
    }

    // Check contract year
    const currentYear = new Date().getFullYear();
    if (!novoContrato.ano) {
      newErrors.ano = "Ano é obrigatório.";
    } else if (novoContrato.ano > currentYear) {
      newErrors.ano = "O ano não pode ser posterior ao ano atual.";
    }

    if (!novoContrato.objeto.trim()) {
      newErrors.objeto = "Objeto é obrigatório.";
    }

    if (!novoContrato.fornecedor_id) {
      newErrors.fornecedor_id = "Selecione um fornecedor.";
    }

    if (!novoContrato.procedimento_id) {
      newErrors.procedimento_id = "Informe o procedimento";
    }

    if (!novoContrato.procedimento_id.trim()) {
      newErrors.procedimento = "Procedimento é obrigatório.";
    }

    if (!novoContrato.dataDaAssinatura) {
      newErrors.dataDaAssinatura = "Data da assinatura é obrigatória.";
    }

    if (!novoContrato.dataDeTermino) {
      newErrors.dataDeTermino = "Data de término é obrigatória.";
    }

    if (novoContrato.dataDaAssinatura && novoContrato.dataDeTermino && novoContrato.dataDeTermino < novoContrato.dataDaAssinatura) {
      newErrors.dataDeTermino = "A data de término não pode ser anterior à data da assinatura.";
    }

    setErrors(newErrors);

    // Check if there's any error added
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      const contrato = { ...novoContrato, id: Date.now() };
      setContratos([...contratos, contrato]);
      setNovoContrato(initialContrato);
      navigate("/contratos");
    } else {
      return;
    }
  }

  return (
    <>
      <h2>Adicionar novo contrato</h2>
      <button>Importar arquivo</button>
      <span>Funcionalidade a ser implementada</span>
      <form onSubmit={handleSubmit}>
        <label>
          Ata de Registro de Preços
          <input
            type="text"
            value={novoContrato.ata_id}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                ata_id: e.target.value,
              })
            }
          />
          {errors.numero && <span className="form-error">{errors.ata_id}</span>}
        </label>

        <label>
          Número do contrato
          <input
            type="text"
            value={novoContrato.numero}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                numero: Number(e.target.value),
              })
            }
          />
          {errors.numero && <span className="form-error">{errors.numero}</span>}
        </label>

        <label>
          Ano
          <input
            type="number"
            value={novoContrato.ano}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                ano: e.target.value,
              })
            }
          />
          {errors.ano && <span className="form-error">{errors.ano}</span>}
        </label>

        <label>
          Objeto
          <input
            type="text"
            value={novoContrato.objeto}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                objeto: e.target.value,
              })
            }
          />
          {errors.objeto && <span className="form-error">{errors.objeto}</span>}
        </label>

        <label>
          Fornecedor
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
          {errors.fornecedor_id && <span className="form-error">{errors.fornecedor_id}</span>}
        </label>

        <label>
          Procedimento
          <input
            type="text"
            value={novoContrato.procedimento_id}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                procedimento_id: e.target.value,
              })
            }
          />
          {errors.procedimento_id && <span className="form-error">{errors.procedimento_id}</span>}
        </label>

        <label>
          Status
          <input
            type="text"
            value={novoContrato.status}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                status: e.target.value,
              })
            }
          />
          {errors.status && <span className="form-error">{errors.status}</span>}
        </label>

        <label>
          Valor Global
          <input
            type="text"
            value={novoContrato.valor_global}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                status: e.target.valor_global,
              })
            }
          />
          {errors.valor_global && <span className="form-error">{errors.valor_global}</span>}
        </label>

        <label>
          Prorrogável
          <input
            type="text"
            value={novoContrato.prorrogavel}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                prorrogavel: e.target.value,
              })
            }
          />
          {errors.prorrogavel && <span className="form-error">{errors.prorrogavel}</span>}
        </label>

        <label>
          Data da assinatura
          <input
            type="date"
            value={novoContrato.data_de_assinatura}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                data_de_assinatura: e.target.value,
              })
            }
          />
          {errors.data_de_assinatura && <span className="form-error">{errors.data_de_assinatura}</span>}
        </label>

        <label>
          Data de término
          <input
            type="date"
            value={novoContrato.data_de_termino}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                data_de_termino: e.target.value,
              })
            }
          />
          {errors.data_de_termino && <span className="form-error">{errors.data_de_termino}</span>}
        </label>

        <button type="submit">Adicionar</button>
      </form>
    </>
  );
}
