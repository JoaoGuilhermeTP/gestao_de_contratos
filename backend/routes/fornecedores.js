import { Router } from "express";
import * as fornecedorService from "../services/fornecedorService.js";

const router = Router();

// GET /api/fornecedores
router.get("/", async (req, res) => {
  const fornecedores = await fornecedorService.listarFornecedores();
  res.json(fornecedores);
});

// POST /api/fornecedores
router.post("/", async (req, res) => {
  const novoFornecedor = await fornecedorService.criarFornecedor(req.body);
  res.status(201).json(novoFornecedor);
});

// PUT /api/fornecedores/:id
router.put("/:id", async (req, res) => {
  const fornecedorAtualizado = await fornecedorService.atualizarFornecedor(
    req.params.id,
    req.body
  );
  res.json(fornecedorAtualizado);
});

// GET /api/fornecedores/:fornecedorId/documentos
router.get("/:fornecedorId/documentos", async (req, res) => {
  const documentos = await fornecedorService.listarDocumentosDoFornecedor(
    req.params.fornecedorId
  );
  res.json(documentos);
});

// POST /api/fornecedores/:fornecedorId/documentos
router.post("/:fornecedorId/documentos", async (req, res) => {
  const documentoVinculado =
    await fornecedorService.vincularDocumentoAoFornecedor(
      req.params.fornecedorId,
      req.body
    );
  res.status(201).json(documentoVinculado);
});

export default router;