import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
	return open({
		filename: './backend/database.sqlite',
		driver: sqlite3.Database
	})
}

async function setupDatabase() {
  const db = await openDb();

  await db.exec(`
	CREATE TABLE IF NOT EXISTS fornecedores (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  tipo TEXT NOT NULL,
	  razao_social TEXT NOT NULL,
	  nome_fantasia TEXT,
	  cpf_cnpj TEXT NOT NULL UNIQUE,
	  inscricao_estadual TEXT,
	  inscricao_municipal TEXT,
	  cep TEXT NOT NULL,
	  logradouro TEXT NOT NULL,
	  numero TEXT NOT NULL,
	  bairro TEXT NOT NULL,
	  cidade TEXT NOT NULL,
	  estado TEXT NOT NULL,
	  email TEXT,
	  telefone TEXT,
	  representante_legal TEXT,
	  status TEXT NOT NULL DEFAULT 'Ativo',
	  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
	  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
	)
  `);

  await db.exec(`
	CREATE TABLE IF NOT EXISTS contratos (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  ata_id INTEGER,
	  numero TEXT NOT NULL,
	  ano INTEGER NOT NULL,
	  objeto TEXT NOT NULL,
	  fornecedor_id INTEGER NOT NULL,
	  procedimento_id INTEGER NOT NULL,
	  status TEXT NOT NULL DEFAULT 'Ativo',
	  valor_global REAL NOT NULL,
	  prorrogavel BOOLEAN NOT NULL DEFAULT 0,
	  data_de_assinatura DATETIME NOT NULL,
	  data_de_termino DATETIME NOT NULL,
	  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
	  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
	  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
	)
  `);

  console.log("Banco de dados e tabelas criados com sucesso!");
}

setupDatabase();