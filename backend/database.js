import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  const db = await open({
    filename: './backend/database.sqlite',
    driver: sqlite3.Database
  });

  // Ativa a verificação de chaves estrangeiras no SQLite
  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

export async function setupDatabase() {
  const db = await openDb();

  // 1. Fornecedores
  await db.exec(`
    CREATE TABLE IF NOT EXISTS fornecedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Documentos (Catálogo de certidões e documentos exigidos)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_documento TEXT NOT NULL,
      categoria TEXT NOT NULL,
      esfera TEXT NOT NULL,
      cidade TEXT,
      estado TEXT,
      fonte_website TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Documentos dos Fornecedores
  await db.exec(`
    CREATE TABLE IF NOT EXISTS documentos_fornecedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      documento_id INTEGER NOT NULL,
      fornecedor_id INTEGER NOT NULL,
      emissao DATE NOT NULL,
      validade DATE NOT NULL,
      arquivo_url TEXT,
      status TEXT NOT NULL DEFAULT 'Válido',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (documento_id) REFERENCES documentos(id),
      FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
    )
  `);

  // 4. Secretarias
  // Nota: secretario_titular_id permite NULL para períodos de transição e para evitar dependência circular no cadastro inicial
  await db.exec(`
    CREATE TABLE IF NOT EXISTS secretarias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_secretaria TEXT NOT NULL UNIQUE,
      sigla_secretaria TEXT NOT NULL UNIQUE,
      secretario_titular_id INTEGER,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (secretario_titular_id) REFERENCES servidores(id)
    )
  `);

  // 5. Servidores
  await db.exec(`
    CREATE TABLE IF NOT EXISTS servidores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      secretaria_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      registro_funcional TEXT NOT NULL UNIQUE,
      cargo TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (secretaria_id) REFERENCES secretarias(id)
    )
  `);

  // 6. Processos Administrativos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS processos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      secretaria_requisitante_id INTEGER NOT NULL,
      assunto TEXT NOT NULL,
      data_abertura DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em Andamento',
      link_sistema_eletronico TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (secretaria_requisitante_id) REFERENCES secretarias(id)
    )
  `);

  // 7. Procedimentos Licitatórios / Contratações Diretas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS procedimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      processo_id INTEGER NOT NULL,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      modalidade TEXT NOT NULL,
      objeto TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em Andamento',
      data_homologacao DATE,
      link_pncp TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (processo_id) REFERENCES processos(id)
    )
  `);

  // 8. Atas de Registro de Preços (ARP)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS atas_registro_precos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      objeto TEXT NOT NULL,
      fornecedor_id INTEGER NOT NULL,
      procedimento_id INTEGER NOT NULL,
      data_assinatura DATETIME NOT NULL,
      data_validade DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'Vigente',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
      FOREIGN KEY (procedimento_id) REFERENCES procedimentos(id)
    )
  `);

  // 9. Contratos
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
      FOREIGN KEY (ata_id) REFERENCES atas_registro_precos(id),
      FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
      FOREIGN KEY (procedimento_id) REFERENCES procedimentos(id)
    )
  `);

  // 10. Alterações Contratuais (Aditivos e Apostilamentos)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS alteracoes_contratuais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contrato_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      data_assinatura DATE NOT NULL,
      acrescimo_prazo_dias INTEGER DEFAULT 0,
      valor_acrescimo REAL DEFAULT 0.00,
      valor_supressao REAL DEFAULT 0.00,
      justificativa TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contrato_id) REFERENCES contratos(id)
    )
  `);

  // 11. Autorizações de Fornecimento (AF)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS autorizacoes_de_fornecimento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ata_id INTEGER,
      contrato_id INTEGER,
      procedimento_id INTEGER,
      numero TEXT NOT NULL,
      ano INTEGER NOT NULL,
      fornecedor_id INTEGER NOT NULL,
      objeto TEXT NOT NULL,
      valor_total REAL NOT NULL,
      data_emissao DATETIME NOT NULL,
      prazo_entrega_dias INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Emitida',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ata_id) REFERENCES atas_registro_precos(id),
      FOREIGN KEY (contrato_id) REFERENCES contratos(id),
      FOREIGN KEY (procedimento_id) REFERENCES procedimentos(id),
      FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
    )
  `);

  // 12. Gestão e Fiscalização Contratual
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gestao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servidor_id INTEGER NOT NULL,
      contrato_id INTEGER NOT NULL,
      papel TEXT NOT NULL,
      titularidade TEXT NOT NULL DEFAULT 'Titular',
      portaria_designacao TEXT NOT NULL,
      data_inicio DATE NOT NULL,
      data_fim DATE,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (servidor_id) REFERENCES servidores(id),
      FOREIGN KEY (contrato_id) REFERENCES contratos(id)
    )
  `);

  // 13. Ocorrências de Contrato
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ocorrencias_contrato (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contrato_id INTEGER NOT NULL,
      servidor_id INTEGER NOT NULL,
      data_ocorrencia DATE NOT NULL,
      titulo_ocorrencia TEXT NOT NULL,
      descricao TEXT NOT NULL,
      gravidade TEXT NOT NULL DEFAULT 'Leve',
      prazo_regularizacao DATE,
      status TEXT NOT NULL DEFAULT 'Pendente',
      resposta_fornecedor TEXT,
      anexo_url TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contrato_id) REFERENCES contratos(id),
      FOREIGN KEY (servidor_id) REFERENCES servidores(id)
    )
  `);

  console.log("Banco de dados e todas as 13 tabelas criados com sucesso!");
}

setupDatabase();