import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/fornecedores
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM fornecedores ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/fornecedores:", error);
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
});

// POST /api/fornecedores
router.post("/", async (req, res) => {
  try {
    const {
      tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual,
      inscricao_municipal, cep, logradouro, numero, bairro, cidade,
      estado, email, telefone, representante_legal, status
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO fornecedores (
        tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual,
        inscricao_municipal, cep, logradouro, numero, bairro, cidade,
        estado, email, telefone, representante_legal, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *
      `,
      [
        tipo,
        razao_social,
        nome_fantasia || null,
        cpf_cnpj,
        inscricao_estadual || null,
        inscricao_municipal || null,
        cep || null,
        logradouro || null,
        numero || null,
        bairro || null,
        cidade,
        estado,
        email || null,
        telefone || null,
        representante_legal || null,
        status,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro na rota POST /api/fornecedores:", error);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
});

// PUT /api/fornecedores/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID do fornecedor inválido" });
    }
    
    const {
      tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual,
      inscricao_municipal, cep, logradouro, numero, bairro, cidade,
      estado, email, telefone, representante_legal, status,
    } = req.body;

    const { rows, rowCount } = await pool.query(
      `
      UPDATE fornecedores
      SET tipo = $1, razao_social = $2, nome_fantasia = $3, cpf_cnpj = $4,
          inscricao_estadual = $5, inscricao_municipal = $6, cep = $7,
          logradouro = $8, numero = $9, bairro = $10, cidade = $11, estado = $12,
          email = $13, telefone = $14, representante_legal = $15, status = $16,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *
      `,
      [
        tipo,
        razao_social,
        nome_fantasia || null,
        cpf_cnpj,
        inscricao_estadual || null,
        inscricao_municipal || null,
        cep || null,
        logradouro || null,
        numero || null,
        bairro || null,
        cidade,
        estado,
        email || null,
        telefone || null,
        representante_legal || null,
        status,
        id,
      ]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro na rota PUT /api/fornecedores/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
});

// GET /api/fornecedores/:fornecedorId/documentos
router.get("/:fornecedorId/documentos", async (req, res) => {
  try {
    const fornecedorId = Number(req.params.fornecedorId);
    const { rows } = await pool.query(
      `
      SELECT df.*, d.nome_documento, d.categoria, d.esfera
      FROM documentos_fornecedores df
      INNER JOIN documentos d ON d.id = df.documento_id
      WHERE df.fornecedor_id = $1
      ORDER BY df.validade ASC
      `,
      [fornecedorId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/fornecedores/:fornecedorId/documentos:", error);
    res.status(500).json({ error: "Erro ao buscar documentos do fornecedor" });
  }
});

// POST /api/fornecedores/:fornecedorId/documentos
router.post("/:fornecedorId/documentos", async (req, res) => {
  try {
    const fornecedorId = Number(req.params.fornecedorId);
    const { documento_id, emissao, validade, arquivo_url, status } = req.body;

    const docCheck = await pool.query(
      `
      SELECT d.*, f.estado AS fornecedor_estado, f.cidade AS fornecedor_cidade
      FROM documentos d
      CROSS JOIN fornecedores f
      WHERE d.id = $1 AND f.id = $2
      `,
      [documento_id, fornecedorId]
    );

    const documento = docCheck.rows[0];

    if (!documento) {
      return res.status(404).json({ error: "Fornecedor ou documento não encontrado" });
    }

    const mesmaLocalidade =
      documento.esfera === "Federal" ||
      documento.esfera === "Trabalhista" ||
      (documento.esfera === "Estadual" &&
        documento.estado?.toUpperCase() === documento.fornecedor_estado?.toUpperCase()) ||
      (documento.esfera === "Municipal" &&
        documento.estado?.toUpperCase() === documento.fornecedor_estado?.toUpperCase() &&
        documento.cidade?.toLowerCase() === documento.fornecedor_cidade?.toLowerCase());

    if (!mesmaLocalidade) {
      return res.status(400).json({
        error: "O documento não corresponde à esfera ou à localidade do fornecedor",
      });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO documentos_fornecedores (
        documento_id, fornecedor_id, emissao, validade, arquivo_url, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [documento_id, fornecedorId, emissao, validade, arquivo_url || null, status || "Válido"]
    );

    const { rows } = await pool.query(
      `
      SELECT df.*, d.nome_documento, d.categoria, d.esfera
      FROM documentos_fornecedores df
      INNER JOIN documentos d ON d.id = df.documento_id
      WHERE df.id = $1
      `,
      [insertResult.rows[0].id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro na rota POST /api/fornecedores/:fornecedorId/documentos:", error);
    res.status(500).json({ error: "Erro ao vincular documento ao fornecedor" });
  }
});

export default router;