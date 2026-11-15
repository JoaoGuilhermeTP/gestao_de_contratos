import * as fornecedorRepository from "../repositories/fornecedorRepository.js";
import * as documentoRepository from "../repositories/documentoRepository.js";

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(id, label = "ID do fornecedor inválido") {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createError(400, label);
  }
  return numericId;
}

function normalizeFornecedor(dados) {
  const {
    tipo,
    razao_social,
    nome_fantasia,
    cpf_cnpj,
    inscricao_estadual,
    inscricao_municipal,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    estado,
    email,
    telefone,
    representante_legal,
    status,
  } = dados;

  return {
    tipo: String(tipo || "").trim(),
    razao_social: String(razao_social || "").trim(),
    nome_fantasia: nome_fantasia ? String(nome_fantasia).trim() : null,
    cpf_cnpj: String(cpf_cnpj || "").trim(),
    inscricao_estadual: inscricao_estadual ? String(inscricao_estadual).trim() : null,
    inscricao_municipal: inscricao_municipal ? String(inscricao_municipal).trim() : null,
    cep: cep ? String(cep).trim() : null,
    logradouro: logradouro ? String(logradouro).trim() : null,
    numero: numero ? String(numero).trim() : null,
    bairro: bairro ? String(bairro).trim() : null,
    cidade: String(cidade || "").trim(),
    estado: String(estado || "").trim(),
    email: email ? String(email).trim() : null,
    telefone: telefone ? String(telefone).trim() : null,
    representante_legal: representante_legal ? String(representante_legal).trim() : null,
    status: String(status || "Ativo").trim(),
  };
}

export async function listarFornecedores() {
  return fornecedorRepository.findAll();
}

export async function criarFornecedor(dados) {
  const fornecedorNormalizado = normalizeFornecedor(dados);
  return fornecedorRepository.create(fornecedorNormalizado);
}

export async function atualizarFornecedor(id, dados) {
  const fornecedorId = validateId(id);
  const fornecedorNormalizado = normalizeFornecedor(dados);

  const fornecedorAtualizado = await fornecedorRepository.update(
    fornecedorId,
    fornecedorNormalizado
  );

  if (!fornecedorAtualizado) {
    throw createError(404, "Fornecedor não encontrado");
  }

  return fornecedorAtualizado;
}

export async function listarDocumentosDoFornecedor(fornecedorIdParam) {
  const fornecedorId = validateId(fornecedorIdParam);
  return fornecedorRepository.findDocumentosByFornecedorId(fornecedorId);
}

export async function vincularDocumentoAoFornecedor(fornecedorIdParam, dados) {
  const fornecedorId = validateId(fornecedorIdParam);
  const documentoId = validateId(dados.documento_id, "ID do documento inválido");
  const { emissao, validade, arquivo_url, status } = dados;

  const [fornecedor, documento] = await Promise.all([
    fornecedorRepository.findById(fornecedorId),
    documentoRepository.findById(documentoId),
  ]);

  if (!fornecedor || !documento) {
    throw createError(404, "Fornecedor ou documento não encontrado");
  }

  const mesmaLocalidade =
    documento.esfera === "Federal" ||
    documento.esfera === "Trabalhista" ||
    (documento.esfera === "Estadual" &&
      documento.estado?.toUpperCase() === fornecedor.estado?.toUpperCase()) ||
    (documento.esfera === "Municipal" &&
      documento.estado?.toUpperCase() === fornecedor.estado?.toUpperCase() &&
      documento.cidade?.toLowerCase() === fornecedor.cidade?.toLowerCase());

  if (!mesmaLocalidade) {
    throw createError(
      400,
      "O documento não corresponde à esfera ou à localidade do fornecedor"
    );
  }

  return fornecedorRepository.createDocumentoFornecedor({
    documento_id: documentoId,
    fornecedor_id: fornecedorId,
    emissao,
    validade,
    arquivo_url: arquivo_url || null,
    status: status || "Válido",
  });
}