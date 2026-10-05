import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";

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
    // Check ata number
    if (novoContrato.ata_id && !Number.isInteger(novoContrato.ata_id)) {
      newErrors.ata_id = "Informe uma ata de registro de preços válida";
    }
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
    // Check contract object
    if (!novoContrato.objeto.trim()) {
      newErrors.objeto = "Objeto é obrigatório.";
    }
    // Check contract supplier
    if (!novoContrato.fornecedor_id) {
      newErrors.fornecedor_id = "Selecione um fornecedor.";
    }
    // Check contract procediment
    if (!novoContrato.procedimento_id) {
      newErrors.procedimento_id = "Informe o procedimento";
    }
    // Check contract status
    if (!novoContrato.status.trim()) {
      newErrors.status = "Status é obrigatório.";
    }
    // Check contract global value
    if (!novoContrato.valor_global) {
      newErrors.valor_global = "Valor global é obrigatório.";
    }
    // Check contrato "prorrogavel"
    if (!novoContrato.prorrogavel) {
      newErrors.prorrogavel = "Informe se o contrato é prorrogável.";
    } else if (novoContrato.prorrogavel !== "Sim" && novoContrato.prorrogavel !== "Não") {
      newErrors.prorrogavel = "Valores válidos: Sim ou Não.";
    }
    // Check contrato signing date
    if (!novoContrato.data_de_assinatura) {
      newErrors.data_de_assinatura = "Data de assinatura é obrigatória.";
    }
    // Check contrato due date
    if (!novoContrato.data_de_termino) {
      newErrors.data_de_termino = "Data de término é obrigatória.";
    }
    // Check if due date comes after signing date
    if (novoContrato.data_de_assinatura && novoContrato.data_de_termino && novoContrato.data_de_termino < novoContrato.data_de_assinatura) {
      newErrors.data_de_termino = "A data de término não pode ser anterior à data da assinatura.";
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
    <section className="form-page">
      <header className="form-page-header">
        <div>
          <p className="eyebrow">Cadastro de contratos</p>
          <h1>Novo contrato</h1>
          <p>Preencha os dados abaixo para registrar um novo contrato no sistema.</p>
        </div>
        <div className="import-action">
          <button type="button" className="button-secondary">Importar arquivo</button>
          <span>Disponível em breve</span>
        </div>
      </header>

      <form className="contract-form" onSubmit={handleSubmit}>
        <div className="form-section-heading">
          <strong>Identificação do contrato</strong>
          <span>Dados básicos e vínculo com o fornecedor</span>
        </div>

        {/* Ata de Registro de Preços */}
        <label>
          Ata de Registro de Preços
          <input
            type="number"
            value={novoContrato.ata_id}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                ata_id: Number(e.target.value),
              })
            }
          />
          {errors.ata_id && <span className="form-error">{errors.ata_id}</span>}
        </label>

        {/* Número do Contrato */}
        <label>
          Número do contrato
          <input
            type="text"
            value={novoContrato.numero}
            onChange={(e) =>
              setNovoContrato({
                ...novoContrato,
                numero: e.target.value,
              })
            }
          />
          {errors.numero && <span className="form-error">{errors.numero}</span>}
        </label>

        {/* Ano do Contrato */}
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

        {/* Objeto do Contrato */}
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

        {/* Fornecedor */}
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
                {fornecedor.razao_social} - {fornecedor.cpf_cnpj}
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
          <CurrencyInput
            id="contract-currency-input"
            name="contract-currency-input"
            placeholder="Informe o valor"
            allowNegativeValue={false}
            prefix="R$"
            decimalsLimit={2}
            value={novoContrato.valor_global}
            onValueChange={(value) =>
              setNovoContrato({
                ...novoContrato,
                valor_global: value,
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

        <div className="form-section-heading form-section-heading-spaced">
          <strong>Vigência</strong>
          <span>Informe o período de validade do contrato</span>
        </div>

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

        <div className="form-actions">
          <button type="submit" className="button-primary">Adicionar contrato</button>
        </div>
      </form>
    </section>
  );
}
