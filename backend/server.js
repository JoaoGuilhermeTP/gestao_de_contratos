import express from "express";
import cors from "cors";
import { openDb } from "./database.js"; // Imports database connection

const app = express();

// Middleware

// Enable CORS so that the React frontend cantalk to this backend
app.use(cors());
// Allow Express to parse JSON data from frontend forms
app.use(express.json());

const PORT = 3000;

// ==========================================
// ROTAS DE FORNECEDORES
// ==========================================

// GET: Buscar todos os fornecedores
app.get("/api/fornecedores", async (req, res) => {
  try {
    const db = await openDb();
    const fornecedores = await db.all("SELECT * FROM fornecedores");
    res.json(fornecedores);
  } catch (error) {
    console.error("Erro na rota GET /api/fornecedores:", error); // <-- Adicionado
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
});

// ==========================================
// ROTAS DE CONTRATOS
// ==========================================

// GET: Buscar todos os contratos
app.get("/api/contratos", async (req, res) => {
  try {
    const db = await openDb();
    const contratos = await db.all("SELECT * FROM contratos");
    res.json(contratos);
  } catch (error) {
    console.error("Erro na rota GET /api/contratos:", error); // <-- Adicionado
    res.status(500).json({ error: "Erro ao buscar contratos" });
  }
});

// POST: Criar um novo fornecedor
app.post("/api/fornecedores", async (req, res) => {
  try {
    const db = await openDb();
    const { tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status } =
      req.body;
    const result = await db.run(
      `
      INSERT INTO fornecedores (
      tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
      ],
    );
    const novoFornecedor = await db.get("SELECT * FROM fornecedores WHERE id = ?", result.lastID);
    res.status(201).json(novoFornecedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
});

// PUT: Editar um fornecedor
app.put("/api/fornecedores/:id", async (req, res) => {
  try {
    const db = await openDb();
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

    const result = await db.run(
      `
      UPDATE fornecedores
      SET tipo = ?, razao_social = ?, nome_fantasia = ?, cpf_cnpj = ?,
          inscricao_estadual = ?, inscricao_municipal = ?, cep = ?,
          logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?,
          email = ?, telefone = ?, representante_legal = ?, status = ?,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
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
      ],
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    const fornecedorAtualizado = await db.get("SELECT * FROM fornecedores WHERE id = ?", id);
    res.json(fornecedorAtualizado);
  } catch (error) {
    console.error("Erro na rota PUT /api/fornecedores/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
});

// POST: Criar um novo contrato
app.post("/api/contratos", async (req, res) => {
  try {
    const db = await openDb();
    const { ata_id, numero, ano, objeto, fornecedor_id, procedimento_id, status, valor_global, prorrogavel, data_de_assinatura, data_de_termino } = req.body;

    const result = await db.run(
      `
	  INSERT INTO contratos (
		ata_id, numero, ano, objeto, fornecedor_id, procedimento_id, 
		status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
	  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
      [ata_id || null, numero, ano, objeto, fornecedor_id, procedimento_id, status, valor_global, prorrogavel, data_de_assinatura, data_de_termino],
    );

    // Retorna o contrato recém-criado
    const novoContrato = await db.get("SELECT * FROM contratos WHERE id = ?", result.lastID);
    res.status(201).json(novoContrato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar contrato" });
  }
});

// PUT: Editar um  contrato
app.put("/api/contratos/:id", async (req, res) => {
  try {
    const db = await openDb();
    const id = Number(req.params.id);
    const { ata_id, numero, ano, objeto, fornecedor_id, procedimento_id, status, valor_global, prorrogavel, data_de_assinatura, data_de_termino } = req.body;
    const result = await db.run(
      `
      UPDATE contratos
      SET ata_id = ?, numero = ?, ano = ?, objeto = ?, fornecedor_id = ?,
          procedimento_id = ?, status = ?, valor_global = ?, prorrogavel = ?,
          data_de_assinatura = ?, data_de_termino = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [ata_id || null, numero, ano, objeto, fornecedor_id, procedimento_id, status, valor_global, prorrogavel ? 1 : 0, data_de_assinatura, data_de_termino, id],
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Contrato não encontrado" });
    }

    const contratoAtualizado = await db.get("SELECT * FROM contratos WHERE id = ?", id);
    res.json(contratoAtualizado);
  } catch (error) {
    console.error("Erro na rota PUT /api/contratos/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar contrato" });
  }
});

// DELETE: Deletar um contrato
app.delete("/api/deletar_contrato", async (req, res) => {
  try {
    const db = await openDb();
    const { id } = req.body;
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await db.run(`DELETE FROM contratos WHERE id = ?`, idNumerico);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Contrato não encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar contrato" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ message: "O backend está rodando perfeitamente!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
