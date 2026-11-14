import { pool } from "../database.js";

export async function findAll() {
  const { rows } = await pool.query(
    "SELECT * FROM secretarias ORDER BY id ASC"
  );
  return rows;
}