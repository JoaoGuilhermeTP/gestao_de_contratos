import { Router } from "express";
import * as secretariaService from "../services/secretariaService.js";

const router = Router();

// GET /api/secretarias
router.get("/", async (req, res) => {
  const secretarias = await secretariaService.listarSecretarias();
  res.json(secretarias);
});

export default router;