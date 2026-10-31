import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/contratos
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM contratos ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/contratos:", error);
    res.status(500).json({ error: "Erro ao buscar contratos" });
  }
});

// POST /api/contratos
router.post("/", async (req, res) => {
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
    console.error("Erro na rota POST /api/contratos:", error);
    res.status(500).json({ error: "Erro ao criar contrato" });
  }
});

// PUT /api/contratos/:id
router.put("/:id", async (req, res) => {
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

// DELETE /api/contratos/:id
router.delete("/:id", async (req, res) => {
  try {
    const idNumerico = Number(req.params.id);

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
    console.error("Erro na rota DELETE /api/contratos/:id:", error);
    res.status(500).json({ error: "Erro ao deletar contrato" });
  }
});

export default router;