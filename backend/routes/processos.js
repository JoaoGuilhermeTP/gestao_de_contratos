import { Router } from "express";
import * as processoService from "../services/processoService.js";

const router = Router();

// GET /api/processos
router.get("/", async (req, res) => {
  const processos = await processoService.listarProcessos();
  res.json(processos);
});

export default router;