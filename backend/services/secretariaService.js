import * as secretariaRepository from "../repositories/secretariaRepository.js";

export async function listarSecretarias() {
  return secretariaRepository.findAll();
}