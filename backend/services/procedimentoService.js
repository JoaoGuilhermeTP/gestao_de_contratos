import * as procedimentoRepository from "../repositories/procedimentoRepository.js";

export async function listarProcedimentos() {
  return procedimentoRepository.findAll();
}