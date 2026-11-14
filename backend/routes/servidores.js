import { Router } from "express";
import * as servidorService from "../services/servidorService.js";

const router = Router();

// GET /api/servidores
router.get("/", async (req, res) => {
  const servidores = await servidorService.listarServidores();
  res.json(servidores);
});

// POST /api/servidores
router.post("/", async (req, res) => {
  const novoServidor = await servidorService.criarServidor(req.body);
  res.status(201).json(novoServidor);
});

// PUT /api/servidores/:id
router.put("/:id", async (req, res) => {
  const servidorAtualizado = await servidorService.atualizarServidor(
    req.params.id,
    req.body
  );
  res.json(servidorAtualizado);
});

// DELETE /api/servidores/:id
router.delete("/:id", async (req, res) => {
  await servidorService.deletarServidor(req.params.id);
  res.status(204).send();
});

export default router;