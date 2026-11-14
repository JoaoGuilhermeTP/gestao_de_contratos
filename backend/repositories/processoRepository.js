import { pool } from "../db/database.js";

export async function listarProcessos() {
  return processoRepository.findAll();
}