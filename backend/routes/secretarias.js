import { Router } from "express";
import { pool } from "../database.js";

const router = Router();


// GET /api/secretarias
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * 
      FROM secretarias 
      ORDER BY id ASC`);
    res.json(rows);
  } catch (error) {
    console.error("Erro na rota GET /api/secretarias:", error);
    res.status(500).json({ error: "Erro ao buscar secretarias" });
  }
});

export default router;