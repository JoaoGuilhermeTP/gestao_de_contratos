import { pool } from "../db/database.js";

export async function findAll() {
  const { rows } = await pool.query("SELECT * FROM fornecedores ORDER BY id ASC");
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM fornecedores WHERE id = $1", [id]);
  return rows[0] || null;
}

export async function create({
  tipo,
  razao_social,
  nome_fantasia,
  cpf_cnpj,
  inscricao_estadual,
  inscricao_municipal,
  cep,
  logradouro,
  numero,
  bairro,
  cidade,
  estado,
  email,
  telefone,
  representante_legal,
  status,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO fornecedores (
      tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual,
      inscricao_municipal, cep, logradouro, numero, bairro, cidade,
      estado, email, telefone, representante_legal, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *
    `,
    [tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status],
  );

  return rows[0];
}

export async function update(
  id,
  { tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status },
) {
  const { rows } = await pool.query(
    `
    UPDATE fornecedores
    SET tipo = $1,
        razao_social = $2,
        nome_fantasia = $3,
        cpf_cnpj = $4,
        inscricao_estadual = $5,
        inscricao_municipal = $6,
        cep = $7,
        logradouro = $8,
        numero = $9,
        bairro = $10,
        cidade = $11,
        estado = $12,
        email = $13,
        telefone = $14,
        representante_legal = $15,
        status = $16,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = $17
    RETURNING *
    `,
    [tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status, id],
  );

  return rows[0] || null;
}

export async function findDocumentosByFornecedorId(fornecedorId) {
  const { rows } = await pool.query(
    `
    SELECT df.*, d.nome_documento, d.categoria, d.esfera
    FROM documentos_fornecedores df
    INNER JOIN documentos d ON d.id = df.documento_id
    WHERE df.fornecedor_id = $1
    ORDER BY df.validade ASC
    `,
    [fornecedorId],
  );

  return rows;
}

export async function createDocumentoFornecedor({ documento_id, fornecedor_id, emissao, validade, arquivo_url, status }) {
  const { rows } = await pool.query(
    `
    WITH inserted AS (
      INSERT INTO documentos_fornecedores (
        documento_id, fornecedor_id, emissao, validade, arquivo_url, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    )
    SELECT i.*, d.nome_documento, d.categoria, d.esfera
    FROM inserted i
    INNER JOIN documentos d ON d.id = i.documento_id
    `,
    [documento_id, fornecedor_id, emissao, validade, arquivo_url, status],
  );

  return rows[0];
}
