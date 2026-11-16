// Initial contract object
export const initialContrato = {
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

// Function for validating form
  export function validateForm(novoContrato, setErrors) {
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