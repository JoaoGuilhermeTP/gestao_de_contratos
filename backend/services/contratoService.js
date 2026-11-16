// backend/services/contratoService.js
import * as contratoRepository from "../repositories/contratoRepository.js";
import { findById } from "../repositories/ataRepository.js";

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createError(400, "ID do contrato inválido.");
  }
  return numericId;
}

async function validateAndNormalizeContrato(dados) {
  const { ata_id, numero, ano, objeto, fornecedor_id, procedimento_id, status, valor_global, prorrogavel, data_de_assinatura, data_de_termino } = dados;

  const numeroLimpo = String(numero || "").trim();
  if (!numeroLimpo) {
    throw createError(400, "O número do contrato é obrigatório.");
  }

  const anoNumerico = Number(ano);
  const anoAtual = new Date().getFullYear();
  if (!Number.isInteger(anoNumerico) || anoNumerico < 1900 || anoNumerico > anoAtual + 1) {
    throw createError(400, "Informe um ano válido para o contrato.");
  }

  const objetoLimpo = String(objeto || "").trim();
  if (!objetoLimpo) {
    throw createError(400, "O objeto do contrato é obrigatório.");
  }

  const fornecedorIdNumerico = Number(fornecedor_id);
  if (!Number.isInteger(fornecedorIdNumerico) || fornecedorIdNumerico <= 0) {
    throw createError(400, "Selecione um fornecedor válido.");
  }

  const procedimentoIdNumerico = Number(procedimento_id);
  if (!Number.isInteger(procedimentoIdNumerico) || procedimentoIdNumerico <= 0) {
    throw createError(400, "Informe um procedimento licitatório válido.");
  }

  const valorNumerico = Number(String(valor_global ?? "").replace(",", "."));
  if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
    throw createError(400, "Informe um valor global válido maior que zero.");
  }

  if (!data_de_assinatura || !data_de_termino) {
    throw createError(400, "As datas de assinatura e de término são obrigatórias.");
  }

  if (data_de_termino < data_de_assinatura) {
    throw createError(400, "A data de término não pode ser anterior à data de assinatura.");
  }

  let ataIdNormalizado = null;
  if (ata_id !== undefined && ata_id !== null && ata_id !== "" && Number(ata_id) !== 0) {
    ataIdNormalizado = Number(ata_id);
    if (!Number.isInteger(ataIdNormalizado) || ataIdNormalizado <= 0) {
      throw createError(400, "ID da Ata de Registro de Preços inválido.");
    }
  }

  const prorrogavelNormalizado = prorrogavel === 1 || prorrogavel === true || prorrogavel === "1" || String(prorrogavel).trim().toLowerCase() === "sim" ? 1 : 0;

  if (ata_id) {
    const ata = await findById(ata_id);
    if (ata.objeto !== objeto) {
      throw createError(400, "O objeto do contrato deve corresponder ao objeto da Ata de Registro de Preços da qual ele se originou")
    };
    if (Number(ata.fornecedor_id) !== Number(fornecedor_id)) {
      throw createError(400, "O fornecedor do contrato deve corresponder ao fornecedor da Ata de Registro de Preços da qual ele se originou")
    };
    if (Number(ata.procedimento_id) !== Number(procedimento_id)) {
      throw createError(400, "O procedimento do contrato deve corresponder ao procedimento da Ata de Registro de Preços da qual ele se originou")
    };
  }

  return {
    ata_id: ataIdNormalizado,
    numero: numeroLimpo,
    ano: anoNumerico,
    objeto: objetoLimpo,
    fornecedor_id: fornecedorIdNumerico,
    procedimento_id: procedimentoIdNumerico,
    status: String(status || "Ativo").trim(),
    valor_global: valorNumerico,
    prorrogavel: prorrogavelNormalizado,
    data_de_assinatura,
    data_de_termino,
  };
}

export async function listarContratos() {
  return contratoRepository.findAll();
}

export async function buscarContratoPorId(id) {
  const contratoId = validateId(id);
  const contrato = await contratoRepository.findById(contratoId);

  if (!contrato) {
    throw createError(404, "Contrato não encontrado.");
  }

  return contrato;
}

export async function criarContrato(dados) {
  const dadosValidados = await validateAndNormalizeContrato(dados);
  return contratoRepository.create(dadosValidados);
}

export async function atualizarContrato(id, dados) {
  const contratoId = validateId(id);
  const dadosValidados = validateAndNormalizeContrato(dados);

  const contratoAtualizado = await contratoRepository.update(contratoId, dadosValidados);

  if (!contratoAtualizado) {
    throw createError(404, "Contrato não encontrado.");
  }

  return contratoAtualizado;
}

export async function deletarContrato(id) {
  const contratoId = validateId(id);
  const deletado = await contratoRepository.remove(contratoId);

  if (!deletado) {
    throw createError(404, "Contrato não encontrado.");
  }
}
