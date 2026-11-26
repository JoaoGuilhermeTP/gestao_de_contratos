// backend/server.js
import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/database.js";

import fornecedoresRouter from "./routes/fornecedores.js";
import documentosRouter from "./routes/documentos.js";
import contratosRouter from "./routes/contratos.js";
import servidoresRouter from "./routes/servidores.js";
import secretariasRouter from "./routes/secretarias.js";
import processosRouter from "./routes/processos.js";
import atasRouter from "./routes/atas.js";
import procedimentosRouter from "./routes/procedimentos.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Garante que as tabelas existem quando o servidor inicia
setupDatabase().catch((error) => console.error("Erro ao verificar tabelas no banco de dados:", error));

// Módulos de rotas da API
app.use("/api/fornecedores", fornecedoresRouter);
app.use("/api/documentos", documentosRouter);
app.use("/api/contratos", contratosRouter);
app.use("/api/servidores", servidoresRouter);
app.use("/api/secretarias", secretariasRouter);
app.use("/api/processos", processosRouter);
app.use("/api/atas", atasRouter);
app.use("/api/procedimentos", procedimentosRouter);

app.get("/api/status", (req, res) => {
  res.json({ message: "O backend está rodando perfeitamente com PostgreSQL!" });
});

// Central error handler (catches any error thrown in routes or services)
app.use((err, req, res, next) => {
  console.error(err);

  const postgressStatus = {
    "23505": 409,
    "23503": 409,
    "22P02": 400,
  };

  const status = err.status || postgressStatus[err.code] || 500;
  res.status(status).json({error: err.message || "Erro interno no servidor"});
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
