// backend/routes/contratos.js
import { Router } from "express";
import * as contratoService from "../services/contratoService.js";

const router = Router();

// GET /api/contratos
router.get("/", async (req, res) => {
  const contratos = await contratoService.listarContratos();
  res.json(contratos);
});

// GET /api/contratos/:id
router.get("/:id", async (req, res) => {
  const contrato = await contratoService.buscarContratoPorId(req.params.id);
  res.json(contrato);
});

// POST /api/contratos
router.post("/", async (req, res) => {
  const novoContrato = await contratoService.criarContrato(req.body);
  res.status(201).json(novoContrato);
});

// PUT /api/contratos/:id
router.put("/:id", async (req, res) => {
  const contratoAtualizado = await contratoService.atualizarContrato(req.params.id, req.body);
  res.json(contratoAtualizado);
});

// DELETE /api/contratos/:id
router.delete("/:id", async (req, res) => {
  await contratoService.deletarContrato(req.params.id);
  res.status(204).send();
});

export default router;
