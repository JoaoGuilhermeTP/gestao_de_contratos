import { Router } from "express";
import * as procedimentoService from "../services/procedimentoService.js";

const router = Router();

// GET /api/procedimenos
router.get("/", async (req, res) => {
  const procedimentos = await procedimentoService.listarProcedimentos();
  res.json(procedimentos);
});

export default router;
