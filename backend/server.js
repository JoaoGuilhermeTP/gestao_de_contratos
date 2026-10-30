import express from "express";
import cors from "cors";
import { pool, setupDatabase } from "./database.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Garante que as tabelas existem quando o servidor inicia
setupDatabase().catch((error) =>
  console.error("Erro ao verificar tabelas no banco de dados:", error)
);

// ==========================================
// ROTAS DE FORNECEDORES E DOCUMENTOS
// ==========================================

// GET: Buscar todos os fornecedores
app.get("/api/fornecedores", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM fornecedores ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/fornecedores:", error);
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
});

// GET: Buscar todos os documentos
app.get("/api/documentos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM documentos ORDER BY nome_documento");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/documentos:", error);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
});

// POST: Criar um novo documento
app.post("/api/documentos", async (req, res) => {
  try {
    const {
      nome_documento,
      categoria,
      esfera,
      cidade,
      estado,
      fonte_website,
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO documentos (
        nome_documento, categoria, esfera, cidade, estado, fonte_website
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        nome_documento,
        categoria,
        esfera,
        cidade || null,
        estado || null,
        fonte_website || null,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro na rota POST /api/documentos:", error);
    res.status(500).json({ error: "Erro ao criar documento" });
  }
});

// GET: Buscar os documentos vinculados a um fornecedor
app.get("/api/fornecedores/:fornecedorId/documentos", async (req, res) => {
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

// POST: Vincular um documento a um fornecedor
app.post("/api/fornecedores/:fornecedorId/documentos", async (req, res) => {
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

// POST: Criar um novo fornecedor
app.post("/api/fornecedores", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
});

// PUT: Editar um fornecedor
app.put("/api/fornecedores/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
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

// ==========================================
// ROTAS DE CONTRATOS
// ==========================================

// GET: Buscar todos os contratos
app.get("/api/contratos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM contratos ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/contratos:", error);
    res.status(500).json({ error: "Erro ao buscar contratos" });
  }
});

// POST: Criar um novo contrato
app.post("/api/contratos", async (req, res) => {
  try {
    const {
      ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
      status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO contratos (
        ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
        status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        ata_id || null,
        numero,
        ano,
        objeto,
        fornecedor_id,
        procedimento_id,
        status,
        valor_global,
        prorrogavel ? 1 : 0,
        data_de_assinatura,
        data_de_termino,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar contrato" });
  }
});

// PUT: Editar um contrato
app.put("/api/contratos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
      status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
    } = req.body;

    const { rows, rowCount } = await pool.query(
      `
      UPDATE contratos
      SET ata_id = $1, numero = $2, ano = $3, objeto = $4, fornecedor_id = $5,
          procedimento_id = $6, status = $7, valor_global = $8, prorrogavel = $9,
          data_de_assinatura = $10, data_de_termino = $11, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        ata_id || null,
        numero,
        ano,
        objeto,
        fornecedor_id,
        procedimento_id,
        status,
        valor_global,
        prorrogavel ? 1 : 0,
        data_de_assinatura,
        data_de_termino,
        id,
      ]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Contrato não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro na rota PUT /api/contratos/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar contrato" });
  }
});

// DELETE: Deletar um contrato
app.delete("/api/deletar_contrato", async (req, res) => {
  try {
    const { id } = req.body;
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { rowCount } = await pool.query(
      "DELETE FROM contratos WHERE id = $1",
      [idNumerico]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Contrato não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar contrato" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ message: "O backend está rodando perfeitamente com PostgreSQL!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});