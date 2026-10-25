import { openDb, setupDatabase } from './database.js'; // Ajuste o nome do arquivo se necessário

async function seedDatabase() {
  // Garante que as tabelas existem antes de inserir os dados
  await setupDatabase();
  const db = await openDb();

  try {
    await db.exec('BEGIN TRANSACTION;');

    // Limpa os dados existentes (na ordem inversa das dependências) para permitir rodar o seed múltiplas vezes
    await db.exec(`
      UPDATE secretarias SET secretario_titular_id = NULL;
      DELETE FROM ocorrencias_contrato;
      DELETE FROM gestao;
      DELETE FROM autorizacoes_de_fornecimento;
      DELETE FROM alteracoes_contratuais;
      DELETE FROM contratos;
      DELETE FROM atas_registro_precos;
      DELETE FROM procedimentos;
      DELETE FROM processos;
      DELETE FROM servidores;
      DELETE FROM secretarias;
      DELETE FROM documentos_fornecedores;
      DELETE FROM documentos;
      DELETE FROM fornecedores;
      DELETE FROM sqlite_sequence;
    `);

    // 1. Fornecedores
    await db.exec(`
      INSERT INTO fornecedores (
        tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual, inscricao_municipal,
        cep, logradouro, numero, bairro, cidade, estado, email, telefone, representante_legal, status
      ) VALUES
      (
        'Pessoa Jurídica', 'TechGov Soluções em Informática Ltda', 'TechGov TI', '12.345.678/0001-90',
        '110.042.490.114', '987654-3', '01310-100', 'Av. Paulista', '1500', 'Bela Vista',
        'São Paulo', 'SP', 'licitacoes@techgov.com.br', '(11) 3210-4500', 'Roberto Almeida Prado', 'Ativo'
      ),
      (
        'Pessoa Jurídica', 'Construtora Horizonte Obras Públicas S.A.', 'Horizonte Engenharia', '98.765.432/0001-55',
        '220.153.890.000', '112233-4', '30140-071', 'Av. Brasil', '850', 'Santa Efigênia',
        'Belo Horizonte', 'MG', 'contratos@horizonteeng.com.br', '(31) 3344-5566', 'Fernanda Costa Lima', 'Ativo'
      ),
      (
        'Pessoa Jurídica', 'Papelaria e Suprimentos Escolar Brasil Ltda', 'SupriBrasil', '45.123.890/0001-12',
        '330.987.654.111', '445566-7', '80010-000', 'Rua XV de Novembro', '320', 'Centro',
        'Curitiba', 'PR', 'vendas@supribrasil.com.br', '(41) 3020-1010', 'Marcos Vinícius Souza', 'Ativo'
      );
    `);

    // 2. Documentos (Catálogo de certidões exigidas)
    await db.exec(`
      INSERT INTO documentos (
        nome_documento, categoria, esfera, cidade, estado, fonte_website
      ) VALUES
      (
        'Certidão Negativa de Débitos Trabalhistas (CNDT)', 'Regularidade Trabalhista', 'Trabalhista',
        NULL, NULL, 'https://www.tst.jus.br/certidao1'
      ),
      (
        'Certidão de Débitos Relativos a Créditos Tributários Federais e à Dívida Ativa da União',
        'Regularidade Fiscal', 'Federal', NULL, NULL, 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir'
      ),
      (
        'Certidão Negativa de Tributos Municipais', 'Regularidade Fiscal', 'Municipal',
        'São Paulo', 'SP', 'https://duc.prefeitura.sp.gov.br/'
      );
    `);

    // 3. Documentos dos Fornecedores
    await db.exec(`
      INSERT INTO documentos_fornecedores (
        documento_id, fornecedor_id, emissao, validade, arquivo_url, status
      ) VALUES
      (1, 1, '2026-01-10', '2026-07-09', '/uploads/certidoes/cndt_techgov.pdf', 'Válido'),
      (2, 1, '2026-01-15', '2026-07-14', '/uploads/certidoes/cnd_federal_techgov.pdf', 'Válido'),
      (1, 2, '2026-02-01', '2026-07-31', '/uploads/certidoes/cndt_horizonte.pdf', 'Válido'),
      (3, 3, '2025-06-01', '2025-12-01', '/uploads/certidoes/cnd_municipal_supribrasil.pdf', 'Vencido');
    `);

    // 4. Secretarias (Inseridas inicialmente com secretario_titular_id NULL)
    await db.exec(`
      INSERT INTO secretarias (nome_secretaria, sigla_secretaria, secretario_titular_id) VALUES
      ('Secretaria Municipal de Administração', 'SEMAD', NULL),
      ('Secretaria Municipal de Educação', 'SEMED', NULL),
      ('Secretaria Municipal de Obras e Infraestrutura', 'SEMOB', NULL);
    `);

    // 5. Servidores
    await db.exec(`
      INSERT INTO servidores (
        secretaria_id, nome, registro_funcional, cargo, email, telefone
      ) VALUES
      (1, 'Carlos Eduardo Mendes', 'MAT-1001', 'Secretário Municipal I', 'carlos.mendes@prefeitura.gov.br', '(11) 98888-1001'),
      (1, 'Ana Paula Ribeiro', 'MAT-1045', 'Analista Administrativo', 'ana.ribeiro@prefeitura.gov.br', '(11) 98888-1045'),
      (1, 'João Pedro Santos', 'MAT-1088', 'Técnico de TI', 'joao.santos@prefeitura.gov.br', '(11) 98888-1088'),
      (2, 'Helena Martins Rocha', 'MAT-2001', 'Secretária Municipal I', 'helena.rocha@prefeitura.gov.br', '(11) 98888-2001'),
      (3, 'Ricardo Gomes Oliveira', 'MAT-3001', 'Secretário Municipal I', 'ricardo.oliveira@prefeitura.gov.br', '(11) 98888-3001'),
      (3, 'Gabriel Ferreira Alves', 'MAT-3050', 'Engenheiro Civil', 'gabriel.alves@prefeitura.gov.br', '(11) 98888-3050');
    `);

    // Atualiza os Secretários Titulares nas respectivas Secretarias
    await db.exec(`
      UPDATE secretarias SET secretario_titular_id = 1 WHERE id = 1;
      UPDATE secretarias SET secretario_titular_id = 4 WHERE id = 2;
      UPDATE secretarias SET secretario_titular_id = 5 WHERE id = 3;
    `);

    // 6. Processos Administrativos
    await db.exec(`
      INSERT INTO processos (
        numero, ano, secretaria_requisitante_id, assunto, data_abertura, status, link_sistema_eletronico
      ) VALUES
      (
        '00142/2026', 2026, 1,
        'Registro de Preços para aquisição parcelada de computadores e notebooks',
        '2026-01-08', 'Em Andamento', 'https://sei.prefeitura.gov.br/processos/00142-2026'
      ),
      (
        '00389/2026', 2026, 3,
        'Contratação de empresa especializada para reforma da cobertura do Ginásio Municipal',
        '2026-01-20', 'Em Andamento', 'https://sei.prefeitura.gov.br/processos/00389-2026'
      ),
      (
        '00512/2026', 2026, 2,
        'Aquisição emergencial/direta de kits de material de expediente escolar',
        '2026-02-05', 'Concluído', 'https://sei.prefeitura.gov.br/processos/00512-2026'
      );
    `);

    // 7. Procedimentos Licitatórios
    await db.exec(`
      INSERT INTO procedimentos (
        processo_id, numero, ano, modalidade, objeto, status, data_homologacao, link_pncp
      ) VALUES
      (
        1, '005', 2026, 'Pregão Eletrônico',
        'Registro de Preços para eventual aquisição de estações de trabalho e notebooks para atender às secretarias.',
        'Homologado', '2026-02-15', 'https://pncp.gov.br/app/editais/12345678000199/2026/5'
      ),
      (
        2, '002', 2026, 'Concorrência Eletrônica',
        'Execução de obra de engenharia para reforma estrutural e cobertura do Ginásio Municipal.',
        'Homologado', '2026-03-01', 'https://pncp.gov.br/app/editais/12345678000199/2026/2'
      ),
      (
        3, '012', 2026, 'Dispensa de Licitação',
        'Aquisição direta de materiais de expediente e papelaria para início do ano letivo.',
        'Homologado', '2026-02-10', 'https://pncp.gov.br/app/editais/12345678000199/2026/12'
      );
    `);

    // 8. Atas de Registro de Preços (ARP)
    await db.exec(`
      INSERT INTO atas_registro_precos (
        numero, ano, objeto, fornecedor_id, procedimento_id, data_assinatura, data_validade, status
      ) VALUES
      (
        '010', 2026,
        'Registro de preços para fornecimento de computadores desktop i7 e notebooks 16GB RAM.',
        1, 1, '2026-02-18 10:00:00', '2027-02-18 23:59:59', 'Vigente'
      );
    `);

    // 9. Contratos
    await db.exec(`
      INSERT INTO contratos (
        ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
        status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
      ) VALUES
      (
        1, '024', 2026,
        'Fornecimento de 50 computadores desktop e suporte de garantia on-site (derivado da ARP 010/2026).',
        1, 1, 'Ativo', 275000.00, 1, '2026-03-01 09:00:00', '2027-03-01 23:59:59'
      ),
      (
        NULL, '031', 2026,
        'Execução da reforma da cobertura metálica e pintura do Ginásio Municipal.',
        2, 2, 'Ativo', 840000.00, 1, '2026-03-10 14:30:00', '2026-11-10 23:59:59'
      );
    `);

    // 10. Alterações Contratuais
    await db.exec(`
      INSERT INTO alteracoes_contratuais (
        contrato_id, tipo, data_assinatura, acrescimo_prazo_dias, valor_acrescimo, valor_supressao, justificativa
      ) VALUES
      (
        2, 'Termo Aditivo', '2026-06-15', 30, 42000.00, 0.00,
        'Acréscimo de 5% no valor contratual e prorrogação de 30 dias devido à necessidade de reforço adicional nas treliças laterais (Art. 124, I, a da Lei 14.133/2021).'
      );
    `);

    // 11. Autorizações de Fornecimento (AF)
    await db.exec(`
      INSERT INTO autorizacoes_de_fornecimento (
        ata_id, contrato_id, procedimento_id, numero, ano, fornecedor_id,
        objeto, valor_total, data_emissao, prazo_entrega_dias, status
      ) VALUES
      (
        1, NULL, NULL, 'AF-088', 2026, 1,
        'Consumo direto de saldo da ARP 010/2026: 10 Notebooks para a Secretaria de Educação.',
        58000.00, '2026-03-05 11:15:00', 15, 'Emitida'
      ),
      (
        NULL, 1, NULL, 'AF-095', 2026, 1,
        'Primeira parcela de entrega do Contrato 024/2026: 25 computadores desktop.',
        137500.00, '2026-03-12 16:00:00', 20, 'Emitida'
      ),
      (
        NULL, NULL, 3, 'AF-102', 2026, 3,
        'Emissão direta substituta de contrato (Dispensa 012/2026): Caixas de papel A4, canetas e pastas.',
        18900.00, '2026-02-12 09:30:00', 10, 'Entregue'
      );
    `);

    // 12. Gestão e Fiscalização Contratual
    await db.exec(`
      INSERT INTO gestao (
        servidor_id, contrato_id, papel, titularidade, portaria_designacao, data_inicio, data_fim
      ) VALUES
      (2, 1, 'Gestor de Contrato', 'Titular', 'Portaria SEMAD nº 045/2026', '2026-03-01', NULL),
      (3, 1, 'Fiscal Técnico', 'Titular', 'Portaria SEMAD nº 045/2026', '2026-03-01', NULL),
      (6, 2, 'Fiscal Técnico', 'Titular', 'Portaria SEMOB nº 018/2026', '2026-03-10', NULL);
    `);

    // 13. Ocorrências de Contrato
    await db.exec(`
      INSERT INTO ocorrencias_contrato (
        contrato_id, servidor_id, data_ocorrencia, titulo_ocorrencia, descricao,
        gravidade, prazo_regularizacao, status, resposta_fornecedor, anexo_url
      ) VALUES
      (
        1, 3, '2026-04-02', 'Atraso parcial na entrega do 1º lote de computadores',
        'A empresa entregou 20 das 25 unidades previstas na AF-095, restando 5 unidades pendentes após o vencimento do prazo.',
        'Leve', '2026-04-10', 'Regularizado',
        'Atraso na transportadora devido a retenção fiscal interestadual; as 5 unidades restantes foram entregues em 06/04/2026.',
        '/uploads/ocorrencias/notificacao_001_2026.pdf'
      ),
      (
        2, 6, '2026-05-18', 'Ausência de uso de EPI por parte da equipe terceirizada',
        'Em vistoria técnica no canteiro do Ginásio Municipal, constatou-se 2 operários trabalhando em altura sem linha de vida acoplada.',
        'Grave', '2026-05-19', 'Pendente',
        NULL,
        '/uploads/ocorrencias/relatorio_vistoria_semob_1805.pdf'
      );
    `);

    await db.exec('COMMIT;');
    console.log('Seed executado com sucesso! Todas as 13 tabelas foram populadas.');
  } catch (error) {
    await db.exec('ROLLBACK;');
    console.error('Erro ao executar o seed (transação revertida):', error);
  } finally {
    await db.close();
  }
}

seedDatabase();