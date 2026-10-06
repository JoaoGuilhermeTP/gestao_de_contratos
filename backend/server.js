import express from 'express';
import cors from 'cors';
import { openDb } from './database.js'; // Imports database connection

const app = express();

// Middleware

// Enable CORS so that the React frontend cantalk to this backend
app.use(cors());
// Allow Express to parse JSON data from frontend forms
app.use(express.json());

const PORT = 3000;

// ==========================================
// ROTAS DE FORNECEDORES
// ==========================================

// GET: Buscar todos os fornecedores
app.get('/api/fornecedores', async (req, res) => {
  try {
	const db = await openDb();
	const fornecedores = await db.all('SELECT * FROM fornecedores');
	res.json(fornecedores);
  } catch (error) {
	console.error("Erro na rota GET /api/fornecedores:", error); // <-- Adicionado
	res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});


// ==========================================
// ROTAS DE CONTRATOS
// ==========================================

// GET: Buscar todos os contratos
app.get('/api/contratos', async (req, res) => {
  try {
	const db = await openDb();
	const contratos = await db.all('SELECT * FROM contratos');
	res.json(contratos);
  } catch (error) {
	console.error("Erro na rota GET /api/contratos:", error); // <-- Adicionado
	res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
});


// POST: Criar um novo contrato
app.post('/api/contratos', async (req, res) => {
  try {
	const db = await openDb();
	const { 
	  ata_id, numero, ano, objeto, fornecedor_id, 
	  procedimento_id, status, valor_global, 
	  prorrogavel, data_de_assinatura, data_de_termino 
	} = req.body;

	const result = await db.run(`
	  INSERT INTO contratos (
		ata_id, numero, ano, objeto, fornecedor_id, procedimento_id, 
		status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
	  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, [
	  ata_id || null, numero, ano, objeto, fornecedor_id, procedimento_id, 
	  status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
	]);

	// Retorna o contrato recém-criado
	const novoContrato = await db.get('SELECT * FROM contratos WHERE id = ?', result.lastID);
	res.status(201).json(novoContrato);
  } catch (error) {
	console.error(error);
	res.status(500).json({ error: 'Erro ao criar contrato' });
  }
});


app.get('/api/status', (req, res) => {
	res.json({message: 'O backend está rodando perfeitamente!'});
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Servidor rodando na porta ${PORT}`)
});