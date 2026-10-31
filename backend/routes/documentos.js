import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/documentos
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM documentos ORDER BY nome_documento");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/documentos:", error);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
});

// POST /api/documentos
router.post("/", async (req, res) => {
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

export default router;