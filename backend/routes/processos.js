import { Router } from "express";
import { pool } from "../database.js";

const router = Router();


// GET /api/processos
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * 
      FROM processos 
      ORDER BY id ASC`);
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/processos:", error);
    res.status(500).json({ error: "Erro ao buscar processos" });
  }
});

export default router;