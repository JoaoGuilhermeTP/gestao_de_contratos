import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/servidores
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * 
      FROM servidores 
      ORDER BY id ASC`);
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/servidores:", error);
    res.status(500).json({ error: "Erro ao buscar servidores" });
  }
});

export default router;