import express from "express";
import cors from "cors";
import { setupDatabase } from "./database.js";

import fornecedoresRouter from "./routes/fornecedores.js";
import documentosRouter from "./routes/documentos.js";
import contratosRouter from "./routes/contratos.js";
import servidoresRouter from "./routes/servidores.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Garante que as tabelas existem quando o servidor inicia
setupDatabase().catch((error) =>
  console.error("Erro ao verificar tabelas no banco de dados:", error)
);

// Módulos de rotas da API
app.use("/api/fornecedores", fornecedoresRouter);
app.use("/api/documentos", documentosRouter);
app.use("/api/contratos", contratosRouter);
app.use("/api/servidores", servidoresRouter);

app.get("/api/status", (req, res) => {
  res.json({ message: "O backend está rodando perfeitamente com PostgreSQL!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});