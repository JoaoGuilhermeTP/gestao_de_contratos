import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Mantém DATE (1082) e TIMESTAMP (1114) como texto ("YYYY-MM-DD") igual ao SQLite
pg.types.setTypeParser(1082, (value) => value);
pg.types.setTypeParser(1114, (value) => value);

if (!process.env.DATABASE_URL) {
  console.error("ERRO: A variável de ambiente DATABASE_URL não está definida nos Secrets!");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function setupDatabase() {
  // 1. Fornecedores
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fornecedores (
      id SERIAL PRIMARY KEY,
      tipo TEXT NOT NULL,
      razao_social TEXT NOT NULL,
      nome_fantasia TEXT,
      cpf_cnpj TEXT NOT NULL UNIQUE,
      inscricao_estadual TEXT,
      inscricao_municipal TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      bairro TEXT,
      cidade TEXT NOT NULL,
      estado TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      representante_legal TEXT,
      status TEXT NOT NULL DEFAULT 'Ativo',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Documentos (Catálogo de certidões e documentos exigidos)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documentos (
      id SERIAL PRIMARY KEY,
      nome_documento TEXT NOT NULL,
      categoria TEXT NOT NULL,
      esfera TEXT NOT NULL,
      cidade TEXT,
      estado TEXT,
      fonte_website TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Documentos dos Fornecedores
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documentos_fornecedores (
      id SERIAL PRIMARY KEY,
      documento_id INTEGER NOT NULL REFERENCES documentos(id),
      fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
      emissao DATE NOT NULL,
      validade DATE NOT NULL,
      arquivo_url TEXT,
      status TEXT NOT NULL DEFAULT 'Válido',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Secretarias
  await pool.query(`
    CREATE TABLE IF NOT EXISTS secretarias (
      id SERIAL PRIMARY KEY,
      nome_secretaria TEXT NOT NULL UNIQUE,
      sigla_secretaria TEXT NOT NULL UNIQUE,
      secretario_titular_id INTEGER,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Servidores
  await pool.query(`
    CREATE TABLE IF NOT EXISTS servidores (
      id SERIAL PRIMARY KEY,
      secretaria_id INTEGER NOT NULL REFERENCES secretarias(id),
      nome TEXT NOT NULL,
      registro_funcional TEXT NOT NULL UNIQUE,
      cargo TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Processos Administrativos
  await pool.query(`
    CREATE TABLE IF NOT EXISTS processos (
      id SERIAL PRIMARY KEY,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      secretaria_requisitante_id INTEGER NOT NULL REFERENCES secretarias(id),
      assunto TEXT NOT NULL,
      data_abertura DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em Andamento',
      link_sistema_eletronico TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Procedimentos Licitatórios / Contratações Diretas
  await pool.query(`
    CREATE TABLE IF NOT EXISTS procedimentos (
      id SERIAL PRIMARY KEY,
      processo_id INTEGER NOT NULL REFERENCES processos(id),
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      modalidade TEXT NOT NULL,
      objeto TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em Andamento',
      data_homologacao DATE,
      link_pncp TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Atas de Registro de Preços (ARP)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS atas_registro_precos (
      id SERIAL PRIMARY KEY,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      objeto TEXT NOT NULL,
      fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
      procedimento_id INTEGER NOT NULL REFERENCES procedimentos(id),
      data_assinatura TIMESTAMP NOT NULL,
      data_validade TIMESTAMP NOT NULL,
      status TEXT NOT NULL DEFAULT 'Vigente',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Contratos
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contratos (
      id SERIAL PRIMARY KEY,
      ata_id INTEGER REFERENCES atas_registro_precos(id),
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      objeto TEXT NOT NULL,
      fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
      procedimento_id INTEGER NOT NULL REFERENCES procedimentos(id),
      status TEXT NOT NULL DEFAULT 'Ativo',
      valor_global REAL NOT NULL,
      prorrogavel INTEGER NOT NULL DEFAULT 0,
      data_de_assinatura TIMESTAMP NOT NULL,
      data_de_termino TIMESTAMP NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Alterações Contratuais (Aditivos e Apostilamentos)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alteracoes_contratuais (
      id SERIAL PRIMARY KEY,
      contrato_id INTEGER NOT NULL REFERENCES contratos(id),
      tipo TEXT NOT NULL,
      data_assinatura DATE NOT NULL,
      acrescimo_prazo_dias INTEGER DEFAULT 0,
      valor_acrescimo REAL DEFAULT 0.00,
      valor_supressao REAL DEFAULT 0.00,
      justificativa TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Autorizações de Fornecimento (AF)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS autorizacoes_de_fornecimento (
      id SERIAL PRIMARY KEY,
      ata_id INTEGER REFERENCES atas_registro_precos(id),
      contrato_id INTEGER REFERENCES contratos(id),
      procedimento_id INTEGER REFERENCES procedimentos(id),
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
      objeto TEXT NOT NULL,
      valor_total REAL NOT NULL,
      data_emissao TIMESTAMP NOT NULL,
      prazo_entrega_dias INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Emitida',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Gestão e Fiscalização Contratual
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gestao (
      id SERIAL PRIMARY KEY,
      servidor_id INTEGER NOT NULL REFERENCES servidores(id),
      contrato_id INTEGER NOT NULL REFERENCES contratos(id),
      papel TEXT NOT NULL,
      titularidade TEXT NOT NULL DEFAULT 'Titular',
      portaria_designacao TEXT NOT NULL,
      data_inicio DATE NOT NULL,
      data_fim DATE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. Ocorrências de Contrato
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ocorrencias_contrato (
      id SERIAL PRIMARY KEY,
      contrato_id INTEGER NOT NULL REFERENCES contratos(id),
      servidor_id INTEGER NOT NULL REFERENCES servidores(id),
      data_ocorrencia DATE NOT NULL,
      titulo_ocorrencia TEXT NOT NULL,
      descricao TEXT NOT NULL,
      gravidade TEXT NOT NULL DEFAULT 'Leve',
      prazo_regularizacao DATE,
      status TEXT NOT NULL DEFAULT 'Pendente',
      resposta_fornecedor TEXT,
      anexo_url TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Banco de dados PostgreSQL e todas as 13 tabelas criados com sucesso!");
}