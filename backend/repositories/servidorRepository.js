import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query(
    "SELECT * FROM servidores ORDER BY id ASC"
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM servidores WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

export async function create({
  secretaria_id,
  nome,
  registro_funcional,
  cargo,
  email,
  telefone,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO servidores (
      secretaria_id, nome, registro_funcional, cargo, email, telefone
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [secretaria_id, nome, registro_funcional, cargo, email, telefone]
  );

  return rows[0];
}

export async function update(
  id,
  { secretaria_id, nome, registro_funcional, cargo, email, telefone }
) {
  const { rows } = await pool.query(
    `
    UPDATE servidores
    SET secretaria_id = $1,
        nome = $2,
        registro_funcional = $3,
        cargo = $4,
        email = $5,
        telefone = $6,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
    `,
    [secretaria_id, nome, registro_funcional, cargo, email, telefone, id]
  );

  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM servidores WHERE id = $1",
    [id]
  );

  return rowCount > 0;
}