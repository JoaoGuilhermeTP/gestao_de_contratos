import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query("SELECT * FROM atas_registro_precos ORDER BY data_assinatura ASC");
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM atas_registro_precos WHERE id = $1", [id]);
  return rows[0] || null;
}
