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


// POST /api/servidores
router.post("/", async (req, res) => {
  try {
    const { secretaria_id, nome, registro_funcional, cargo, email, telefone } =
      req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO servidores (
        secretaria_id, nome, registro_funcional, cargo, email, telefone
      ) VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        secretaria_id,
        nome,
        registro_funcional,
        cargo,
        email || null,
        telefone || null,
      ],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro na rota POST /api/servidores:", error);
    res.status(500).json({ error: "Erro ao criar servidor" });
  }
});


// PUT /api/servidores/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID do servidor inválido" });
    }

    const { secretaria_id, nome, registro_funcional, cargo, email, telefone } =
      req.body;

    const { rows, rowCount } = await pool.query(
      `
      UPDATE servidores
      SET secretaria_id = $1, nome = $2, registro_funcional = $3, cargo = $4,
          email = $5, telefone = $6, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [
        secretaria_id,
        nome,
        registro_funcional,
        cargo,
        email || null,
        telefone || null,
        id
      ],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Servidor não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro na rota PUT /api/servidores/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar servidor" });
  }
});


// DELETE /api/servidores/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID do servidor inválido" });
    }

    const { rowCount } = await pool.query(
      `
      DELETE FROM servidores
      WHERE id = $1
      `,
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Servidor não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro na rota DELETE /api/servidores/:id:", error);

    res.status(500).json({ error: "Erro ao deletar servidor" });
  }
});

export default router;
