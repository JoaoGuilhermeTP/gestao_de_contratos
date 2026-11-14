import { Router } from "express";
import * as ataService from "../services/ataService.js";

const router = Router();

// GET /api/atas
router.get("/", async (req, res) => {
  const atas = await ataService.listarAtas();
  res.json(atas);
});

export default router;
