import { pool, setupDatabase } from './database.js';

async function seedDatabase() {
  // Garante que as tabelas existem antes de inserir os dados
  await setupDatabase();
  const client = await pool.connect();

  try {
    await client.query('BEGIN;');

    // Limpa todos os dados existentes e reinicia a contagem dos IDs (SERIAL) para 1
    await client.query(`
      TRUNCATE TABLE
        ocorrencias_contrato,
        gestao,
        autorizacoes_de_fornecimento,
        alteracoes_contratuais,
        contratos,
        atas_registro_precos,
        procedimentos,
        processos,
        servidores,
        secretarias,
        documentos_fornecedores,
        documentos,
        fornecedores
      RESTART IDENTITY CASCADE;
    `);

    // 1. Fornecedores
    await client.query(`
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

    const localidades = [
      ['Rio Branco', 'AC'], ['Maceió', 'AL'], ['Macapá', 'AP'], ['Manaus', 'AM'],
      ['Salvador', 'BA'], ['Fortaleza', 'CE'], ['Brasília', 'DF'], ['Vitória', 'ES'],
      ['Goiânia', 'GO'], ['São Luís', 'MA'], ['Cuiabá', 'MT'], ['Campo Grande', 'MS'],
      ['Belo Horizonte', 'MG'], ['Belém', 'PA'], ['João Pessoa', 'PB'], ['Curitiba', 'PR'],
      ['Recife', 'PE'], ['Teresina', 'PI'], ['Rio de Janeiro', 'RJ'], ['Natal', 'RN'],
      ['Porto Alegre', 'RS'], ['Porto Velho', 'RO'], ['Boa Vista', 'RR'], ['Florianópolis', 'SC'],
      ['São Paulo', 'SP'], ['Aracaju', 'SE'], ['Palmas', 'TO'],
    ];

    // Completa o catálogo com fornecedores distribuídos pelas 27 unidades federativas
    for (let index = 0; index < 47; index += 1) {
      const [cidade, estado] = localidades[index % localidades.length];
      const numero = String(index + 4).padStart(2, '0');
      await client.query(
        `
        INSERT INTO fornecedores (
          tipo, razao_social, nome_fantasia, cpf_cnpj, inscricao_estadual,
          inscricao_municipal, cep, logradouro, numero, bairro, cidade, estado,
          email, telefone, representante_legal, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `,
        [
          'Pessoa Jurídica',
          `Fornecedor Regional ${numero} Serviços Ltda`,
          `Regional ${numero}`,
          `10.000.000/0001-${numero}`,
          `${estado}000000${numero}`,
          `IM-${numero}`,
          '70000-000',
          'Avenida das Licitações',
          String(100 + index),
          'Centro',
          cidade,
          estado,
          `contato${numero}@fornecedorregional.com.br`,
          `(00) 90000-${numero}`,
          `Representante Regional ${numero}`,
          index % 9 === 0 ? 'Suspenso' : 'Ativo',
        ]
      );
    }

    // 2. Documentos (Catálogo de certidões exigidas)
    await client.query(`
      INSERT INTO documentos (
        nome_documento, categoria, esfera, cidade, estado, fonte_website
      ) VALUES
      (
        'Certidão Negativa de Débitos Trabalhistas (CNDT)', 'Regularidade Trabalhista', 'Trabalhista',
        NULL, NULL, 'https://cndt-certidao.tst.jus.br/consultarCertidao.faces'
      ),
      (
        'Certidão de Débitos Relativos a Créditos Tributários Federais e à Dívida Ativa da União',
        'Regularidade Fiscal', 'Federal', NULL, NULL, 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir'
      ),
      (
        'Certidão Negativa de Tributos Municipais', 'Regularidade Fiscal', 'Municipal',
        'São Paulo', 'SP', 'https://duc.prefeitura.sp.gov.br/'
      ),
      (
        'Certificado de Regularidade do FGTS (CRF)', 'Regularidade Fiscal', 'Federal',
        NULL, NULL, 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf'
      ),
      (
        'Certidão Negativa de Débitos Tributários Estaduais de São Paulo',
        'Regularidade Fiscal', 'Estadual', NULL, 'SP',
        'https://www10.fazenda.sp.gov.br/CertidaoNegativaDeb/Pages/EmissaoCertidaoNegativa.aspx'
      ),
      (
        'Certidão Negativa de Débitos Tributários Estaduais de Minas Gerais',
        'Regularidade Fiscal', 'Estadual', NULL, 'MG',
        'https://www.fazenda.mg.gov.br/empresas/certidao-debitos/'
      ),
      (
        'Certidão Negativa de Tributos Municipais de Curitiba',
        'Regularidade Fiscal', 'Municipal', 'Curitiba', 'PR',
        'https://www.curitiba.pr.gov.br/servicos/certidao-negativa-de-debitos/34'
      ),
      (
        'Certidão Negativa de Tributos Municipais de Belo Horizonte',
        'Regularidade Fiscal', 'Municipal', 'Belo Horizonte', 'MG',
        'https://prefeitura.pbh.gov.br/fazenda/certidoes'
      ),
      (
        'Certidão de Regularidade perante a Fazenda Estadual do Paraná',
        'Regularidade Fiscal', 'Estadual', NULL, 'PR',
        'https://www.fazenda.pr.gov.br/Pagina/Certidao-de-Debitos-Tributarios'
      ),
      (
        'Certidão Negativa de Débitos de Imóvel Rural (CND Rural)',
        'Regularidade Fiscal', 'Federal', NULL, NULL,
        'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/ITR/Emitir'
      );
    `);

    const documentosEstaduais = [
      ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'],
      ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'],
      ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'],
      ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'],
      ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
      ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'],
      ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
    ];

    for (const [sigla, nome] of documentosEstaduais) {
      await client.query(
        `
        INSERT INTO documentos (
          nome_documento, categoria, esfera, cidade, estado, fonte_website
        ) VALUES ($1, $2, 'Estadual', NULL, $3, $4)
        `,
        [
          `Certidão Negativa de Débitos Estaduais - ${nome}`,
          'Regularidade Fiscal',
          sigla,
          `https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal-${sigla.toLowerCase()}`,
        ]
      );
    }

    const documentosFederais = [
      ['Certidão Negativa de Débitos Federais - Pessoa Jurídica', 'Regularidade Fiscal', 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir'],
      ['Certificado de Regularidade do FGTS - CRF', 'Regularidade Fiscal', 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf'],
      ['Certidão Negativa de Débitos do INSS', 'Regularidade Previdenciária', 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir'],
      ['Certidão Negativa de Débitos Trabalhistas - CNDT', 'Regularidade Trabalhista', 'https://cndt-certidao.tst.jus.br/consultarCertidao.faces'],
      ['Certidão de Regularidade do SICAF', 'Habilitação', 'https://www.gov.br/compras/pt-br/sistemas/conheca-o-compras/sicaf-digital'],
      ['Certidão Negativa de Débitos de Imóvel Rural', 'Regularidade Fiscal', 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/ITR/Emitir'],
      ['Certidão de Distribuição de Ações e Execuções Federais', 'Regularidade Jurídica', 'https://www.cjf.jus.br/cjf/certidao-negativa'],
      ['Comprovante de Inscrição e Situação Cadastral no CNPJ', 'Regularidade Cadastral', 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp'],
      ['Certidão Negativa de Débitos perante o IBAMA', 'Regularidade Ambiental', 'https://www.gov.br/ibama/pt-br/servicos/certidoes'],
      ['Certidão de Quitação Eleitoral da Pessoa Jurídica', 'Regularidade Jurídica', 'https://www.tse.jus.br/servicos-eleitorais/certidoes'],
    ];

    for (const [nome, categoria, fonte] of documentosFederais) {
      await client.query(
        `
        INSERT INTO documentos (
          nome_documento, categoria, esfera, cidade, estado, fonte_website
        ) VALUES ($1, $2, 'Federal', NULL, NULL, $3)
        `,
        [nome, categoria, fonte]
      );
    }

    const documentosMunicipais = [
      ['Certidão Negativa de Tributos Municipais de São Paulo', 'São Paulo', 'SP', 'https://duc.prefeitura.sp.gov.br/'],
      ['Certidão Negativa de Tributos Municipais de Belo Horizonte', 'Belo Horizonte', 'MG', 'https://prefeitura.pbh.gov.br/fazenda/certidoes'],
      ['Certidão Negativa de Tributos Municipais de Curitiba', 'Curitiba', 'PR', 'https://www.curitiba.pr.gov.br/servicos/certidao-negativa-de-debitos/34'],
    ];

    for (const [nome, cidade, estado, fonte] of documentosMunicipais) {
      await client.query(
        `
        INSERT INTO documentos (
          nome_documento, categoria, esfera, cidade, estado, fonte_website
        ) VALUES ($1, 'Regularidade Fiscal', 'Municipal', $2, $3, $4)
        `,
        [nome, cidade, estado, fonte]
      );
    }

    // 3. Documentos dos Fornecedores
    await client.query(`
      INSERT INTO documentos_fornecedores (
        documento_id, fornecedor_id, emissao, validade, arquivo_url, status
      ) VALUES
      (1, 1, '2026-08-10', '2027-02-06', '/uploads/certidoes/cndt_techgov.pdf', 'Válido'),
      (2, 1, '2026-08-15', '2027-02-11', '/uploads/certidoes/cnd_federal_techgov.pdf', 'Válido'),
      (1, 2, '2026-08-01', '2027-01-29', '/uploads/certidoes/cndt_horizonte.pdf', 'Válido'),
      (7, 3, '2025-06-01', '2025-12-01', '/uploads/certidoes/cnd_municipal_supribrasil.pdf', 'Vencido');
    `);

    // 4. Secretarias
    await client.query(`
      INSERT INTO secretarias (nome_secretaria, sigla_secretaria, secretario_titular_id) VALUES
      ('Secretaria Municipal de Administração', 'SEMAD', NULL),
      ('Secretaria Municipal de Educação', 'SEMED', NULL),
      ('Secretaria Municipal de Obras e Infraestrutura', 'SEMOB', NULL);
    `);

    // 5. Servidores
    await client.query(`
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
    await client.query(`
      UPDATE secretarias SET secretario_titular_id = 1 WHERE id = 1;
      UPDATE secretarias SET secretario_titular_id = 4 WHERE id = 2;
      UPDATE secretarias SET secretario_titular_id = 5 WHERE id = 3;
    `);

    // 6. Processos Administrativos
    await client.query(`
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
    await client.query(`
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
    await client.query(`
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
    await client.query(`
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

    // Completa a listagem de contratos usando procedimentos e fornecedores existentes
    for (let index = 0; index < 50; index += 1) {
      const fornecedorId = (index % 50) + 1;
      const procedimentoId = (index % 3) + 1;
      const contratoNumero = String(index + 33).padStart(3, '0');
      const mes = String((index % 12) + 1).padStart(2, '0');
      const dia = String((index % 26) + 1).padStart(2, '0');
      const status = index % 8 === 0 ? 'Encerrado' : 'Ativo';

      await client.query(
        `
        INSERT INTO contratos (
          ata_id, numero, ano, objeto, fornecedor_id, procedimento_id,
          status, valor_global, prorrogavel, data_de_assinatura, data_de_termino
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          null,
          contratoNumero,
          2026,
          `Prestação de serviços e fornecimento de materiais para a administração pública - lote ${index + 1}.`,
          fornecedorId,
          procedimentoId,
          status,
          45000 + (index * 12750),
          index % 2,
          `2026-${mes}-${dia} 09:00:00`,
          `2027-${mes}-${dia} 23:59:59`,
        ]
      );
    }

    // 10. Alterações Contratuais
    await client.query(`
      INSERT INTO alteracoes_contratuais (
        contrato_id, tipo, data_assinatura, acrescimo_prazo_dias, valor_acrescimo, valor_supressao, justificativa
      ) VALUES
      (
        2, 'Termo Aditivo', '2026-06-15', 30, 42000.00, 0.00,
        'Acréscimo de 5% no valor contratual e prorrogação de 30 dias devido à necessidade de reforço adicional nas treliças laterais (Art. 124, I, a da Lei 14.133/2021).'
      );
    `);

    // 11. Autorizações de Fornecimento (AF)
    await client.query(`
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
    await client.query(`
      INSERT INTO gestao (
        servidor_id, contrato_id, papel, titularidade, portaria_designacao, data_inicio, data_fim
      ) VALUES
      (2, 1, 'Gestor de Contrato', 'Titular', 'Portaria SEMAD nº 045/2026', '2026-03-01', NULL),
      (3, 1, 'Fiscal Técnico', 'Titular', 'Portaria SEMAD nº 045/2026', '2026-03-01', NULL),
      (6, 2, 'Fiscal Técnico', 'Titular', 'Portaria SEMOB nº 018/2026', '2026-03-10', NULL);
    `);

    // 13. Ocorrências de Contrato
    await client.query(`
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

    await client.query('COMMIT;');
    console.log('Seed executado com sucesso! Todas as 13 tabelas foram populadas no Neon.');
  } catch (error) {
    await client.query('ROLLBACK;');
    console.error('Erro ao executar o seed (transação revertida):', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();