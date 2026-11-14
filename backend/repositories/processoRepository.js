import * as processoRepository from "../repositories/processoRepository.js";

export async function listarProcessos() {
  return processoRepository.findAll();
}