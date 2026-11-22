// backend/repositories/contratoRepository.js
import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query(
    "SELECT * FROM contratos ORDER BY data_de_termino ASC"
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM contratos WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

export async function create({
  ata_id,
  numero,
  ano,
  objeto,
  fornecedor_id,
  procedimento_id,
  status,
  valor_global,
  prorrogavel,
  data_de_assinatura,
  data_de_termino,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO contratos (
      ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
      status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
    `,
    [
      ata_id,
      numero,
      ano,
      objeto,
      fornecedor_id,
      procedimento_id,
      status,
      valor_global,
      prorrogavel,
      data_de_assinatura,
      data_de_termino,
    ]
  );

  return rows[0];
}

export async function update(
  id,
  {
    ata_id,
    numero,
    ano,
    objeto,
    fornecedor_id,
    procedimento_id,
    status,
    valor_global,
    prorrogavel,
    data_de_assinatura,
    data_de_termino,
  }
) {
  const { rows } = await pool.query(
    `
    UPDATE contratos
    SET ata_id = $1,
        numero = $2,
        ano = $3,
        objeto = $4,
        fornecedor_id = $5,
        procedimento_id = $6,
        status = $7,
        valor_global = $8,
        prorrogavel = $9,
        data_de_assinatura = $10,
        data_de_termino = $11,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = $12
    RETURNING *
    `,
    [
      ata_id,
      numero,
      ano,
      objeto,
      fornecedor_id,
      procedimento_id,
      status,
      valor_global,
      prorrogavel,
      data_de_assinatura,
      data_de_termino,
      id,
    ]
  );

  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM contratos WHERE id = $1",
    [id]
  );

  return rowCount > 0;
}