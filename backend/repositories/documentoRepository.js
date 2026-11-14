import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query("SELECT * FROM documentos ORDER BY nome_documento ASC");
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM documentos WHERE id = $1", [id]);
  return rows[0] || null;
}

export async function create({ nome_documento, categoria, esfera, cidade, estado, fonte_website }) {
  const { rows } = await pool.query(
    `
    INSERT INTO documentos (
      nome_documento, categoria, esfera, cidade, estado, fonte_website
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [nome_documento, categoria, esfera, cidade, estado, fonte_website],
  );

  return rows[0];
}
