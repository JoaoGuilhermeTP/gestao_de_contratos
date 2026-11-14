import * as documentoRepository from "../repositories/documentoRepository.js";

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateAndNormalizeDocumento(dados) {
  const {
    nome_documento,
    categoria,
    esfera,
    cidade,
    estado,
    fonte_website,
  } = dados;

  const nomeLimpo = String(nome_documento || "").trim();
  if (!nomeLimpo) {
    throw createError(400, "O nome do documento é obrigatório.");
  }

  const categoriaLimpa = String(categoria || "").trim();
  if (!categoriaLimpa) {
    throw createError(400, "A categoria do documento é obrigatória.");
  }

  const esferaLimpa = String(esfera || "").trim();
  if (!esferaLimpa) {
    throw createError(400, "A esfera do documento é obrigatória.");
  }

  return {
    nome_documento: nomeLimpo,
    categoria: categoriaLimpa,
    esfera: esferaLimpa,
    cidade: cidade ? String(cidade).trim() : null,
    estado: estado ? String(estado).trim().toUpperCase() : null,
    fonte_website: fonte_website ? String(fonte_website).trim() : null,
  };
}

export async function listarDocumentos() {
  return documentoRepository.findAll();
}

export async function criarDocumento(dados) {
  const dadosValidados = validateAndNormalizeDocumento(dados);
  return documentoRepository.create(dadosValidados);
}