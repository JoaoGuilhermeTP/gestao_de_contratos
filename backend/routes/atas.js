import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/contratos
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM atas_registro_precos ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/atas:", error);
    res.status(500).json({ error: "Erro ao buscar atas de registro de preços" });
  }
});

export default router;