import * as ataRepository from "../repositories/ataRepository.js";

export async function listarAtas() {
  return ataRepository.findAll();
}