import { openDb } from './database.js';

async function seed() {
  const db = await openDb();

  await db.run('BEGIN TRANSACTION');

  try {
    const fornecedores = [
      ['Pessoa Jurídica', 'Papelaria Central Ltda', '00.000.000/0001-00', '11700-000', 'Avenida Presidente Costa e Silva', '123', 'Boqueirão', 'Praia Grande', 'SP', 'contato@papelariacentral.com', '(13) 3333-0001'],
      ['Pessoa Jurídica', 'Tecnologia Nova Era Ltda', '11.111.111/0001-11', '11013-000', 'Rua XV de Novembro', '456', 'Centro', 'Santos', 'SP', 'contato@novaera.com', '(13) 3333-0002'],
      ['Pessoa Física', 'Marina Alves Consultoria', '222.222.222-22', '11701-000', 'Rua Oceânica', '789', 'Guilhermina', 'Praia Grande', 'SP', 'marina@consultoria.com', '(13) 3333-0003']
    ];

    for (const fornecedor of fornecedores) {
      await db.run(`
        INSERT OR IGNORE INTO fornecedores (
          tipo, razao_social, cpf_cnpj, cep, logradouro, numero,
          bairro, cidade, estado, email, telefone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, fornecedor);
    }

    const papelaria = await db.get(
      'SELECT id FROM fornecedores WHERE cpf_cnpj = ?',
      '00.000.000/0001-00'
    );
    const tecnologia = await db.get(
      'SELECT id FROM fornecedores WHERE cpf_cnpj = ?',
      '11.111.111/0001-11'
    );
    const consultoria = await db.get(
      'SELECT id FROM fornecedores WHERE cpf_cnpj = ?',
      '222.222.222-22'
    );

    const contratos = [
      [1001, 2026, 'Fornecimento de materiais de escritório', papelaria.id, 501, 'Ativo', 18500.00, 1, '2026-01-15', '2026-12-31'],
      [1002, 2026, 'Aquisição de computadores e periféricos', tecnologia.id, 502, 'Ativo', 74200.00, 0, '2026-02-01', '2026-11-30'],
      [1003, 2026, 'Serviços de consultoria administrativa', consultoria.id, 503, 'Ativo', 36000.00, 1, '2026-03-10', '2027-03-09']
    ];

    for (const contrato of contratos) {
      const existente = await db.get(
        'SELECT id FROM contratos WHERE numero = ? AND ano = ?',
        contrato[0],
        contrato[1]
      );

      if (!existente) {
        await db.run(`
          INSERT INTO contratos (
            numero, ano, objeto, fornecedor_id, procedimento_id, status,
            valor_global, prorrogavel, data_de_assinatura, data_de_termino
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, contrato);
      }
    }

    await db.run('COMMIT');
    console.log('Fornecedores e contratos de teste inseridos com sucesso!');
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

seed().catch((error) => {
  console.error('Erro ao inserir dados de teste:', error);
});