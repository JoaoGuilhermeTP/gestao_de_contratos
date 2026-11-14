import { Router } from "express";
import * as documentoService from "../services/documentoService.js";

const router = Router();

// GET /api/documentos
router.get("/", async (req, res) => {
  const documentos = await documentoService.listarDocumentos();
  res.json(documentos);
});

// POST /api/documentos
router.post("/", async (req, res) => {
  const novoDocumento = await documentoService.criarDocumento(req.body);
  res.status(201).json(novoDocumento);
});

export default router;