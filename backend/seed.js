import { openDb } from './database.js';

async function seed() {
  const db = await openDb();
  await db.run(`
	INSERT INTO fornecedores (tipo, razao_social, cpf_cnpj, cep, logradouro, numero, bairro, cidade, estado)
	VALUES ('Pessoa Jurídica', 'Papelaria Central Ltda', '00.000.000/0001-00', '11700-000', 'Avenida Presidente Costa e Silva', '123', 'Boqueirão', 'Praia Grande', 'SP')
  `);
  console.log("Fornecedor de teste inserido com sucesso!");
}

seed();