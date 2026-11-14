import { pool } from "../database.js";

export async function findAll() {
  const { rows } = await pool.query(
    "SELECT * FROM atas_registro_precos ORDER BY id ASC"
  );
  return rows;
}