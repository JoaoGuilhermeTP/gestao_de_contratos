import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddContratoForm({
  contratos,
  setContratos,
  fornecedores,
  setFornecedores,
}) {
  // Navigate hook to navigate to main contratos page after adding new contract
  const navigate = useNavigate();

  // Initial state for contrato
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

  // State variables
  const [novoContrato, setNovoContrato] = useState(initialContrato);
  const [errors, setErrors] = useState({});

  // Function for validating form
  const validateForm = () => {
    const newErrors = {};

    // Check contract number
    if (
      !novoContrato.numero ||
      !Number.isInteger(novoContrato.numero) ||
      novoContrato.numero < 1
    ) {
      newErrors.numero =
        "Número do contrato precsa ser um número maior que zero";
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

    if (!novoContrato.procedimento.trim()) {
      newErrors.procedimento = "Procedimento é obrigatório.";
    }

    if (!novoContrato.tipo.trim()) {
      newErrors.tipo = "Tipo de contrato é obrigatório.";
    }

    if (!novoContrato.dataDaAssinatura) {
      newErrors.dataDaAssinatura = "Data da assinatura é obrigatória.";
    }

    if (!novoContrato.dataDeTermino) {
      newErrors.dataDeTermino = "Data de término é obrigatória.";
    }

    if (
      novoContrato.dataDaAssinatura &&
      novoContrato.dataDeTermino &&
      novoContrato.dataDeTermino < novoContrato.dataDaAssinatura
    ) {
      newErrors.dataDeTermino =
        "A data de término não pode ser anterior à data da assinatura.";
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
          Número do contrato
          <input
            type="number"
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
          {errors.fornecedor_id && (
            <span className="form-error">{errors.fornecedor_id}</span>
          )}
        </label>

        <label>
          Procedimento
          <input
            type="text"
            value={novoContrato.procedimento}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                procedimento: e.target.value,
              })
            }
          />
          {errors.procedimento && (
            <span className="form-error">{errors.procedimento}</span>
          )}
        </label>

        <label>
          Tipo de contrato
          <input
            type="text"
            value={novoContrato.tipo}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                tipo: e.target.value,
              })
            }
          />
          {errors.tipo && <span className="form-error">{errors.tipo}</span>}
        </label>

        <label>
          Data da assinatura
          <input
            type="date"
            value={novoContrato.dataDaAssinatura}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                dataDaAssinatura: e.target.value,
              })
            }
          />
          {errors.dataDaAssinatura && (
            <span className="form-error">{errors.dataDaAssinatura}</span>
          )}
        </label>

        <label>
          Data de término
          <input
            type="date"
            value={novoContrato.dataDeTermino}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                dataDeTermino: e.target.value,
              })
            }
          />
          {errors.dataDeTermino && (
            <span className="form-error">{errors.dataDeTermino}</span>
          )}
        </label>

        <button type="submit">Adicionar</button>
      </form>
    </>
  );
}
