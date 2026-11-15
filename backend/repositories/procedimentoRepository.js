import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query("SELECT * FROM procedimentos ORDER BY id ASC");
  return rows;
}
