import * as servidorRepository from "../repositories/servidorRepository.js";

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createError(400, "ID do servidor inválido");
  }
  return numericId;
}

function validateAndNormalizeServidor(dados) {
  const { secretaria_id, nome, registro_funcional, cargo, email, telefone } = dados;

  const secretariaIdNumerico = Number(secretaria_id);
  if (!Number.isInteger(secretariaIdNumerico) || secretariaIdNumerico <= 0) {
    throw createError(400, "Selecione uma secretaria válida.");
  }

  const nomeLimpo = String(nome || "").trim();
  if (!nomeLimpo) {
    throw createError(400, "O nome do servidor é obrigatório.");
  }

  const registroLimpo = String(registro_funcional || "").trim();
  if (!registroLimpo) {
    throw createError(400, "O registro funcional é obrigatório.");
  }

  const cargoLimpo = String(cargo || "").trim();
  if (!cargoLimpo) {
    throw createError(400, "O cargo é obrigatório.");
  }

  const emailLimpo = email ? String(email).trim() : null;
  const telefoneLimpo = telefone ? String(telefone).trim() : null;

  return {
    secretaria_id: secretariaIdNumerico,
    nome: nomeLimpo,
    registro_funcional: registroLimpo,
    cargo: cargoLimpo,
    email: emailLimpo,
    telefone: telefoneLimpo,
  };
}

export async function listarServidores() {
  return servidorRepository.findAll();
}

export async function criarServidor(dados) {
  const dadosValidados = validateAndNormalizeServidor(dados);
  return servidorRepository.create(dadosValidados);
}

export async function atualizarServidor(id, dados) {
  const servidorId = validateId(id);
  const dadosValidados = validateAndNormalizeServidor(dados);

  const servidorAtualizado = await servidorRepository.update(
    servidorId,
    dadosValidados
  );

  if (!servidorAtualizado) {
    throw createError(404, "Servidor não encontrado");
  }

  return servidorAtualizado;
}

export async function deletarServidor(id) {
  const servidorId = validateId(id);
  const deletado = await servidorRepository.remove(servidorId);

  if (!deletado) {
    throw createError(404, "Servidor não encontrado");
  }
}