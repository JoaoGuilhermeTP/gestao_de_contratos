# Especificação da API REST — Gestão de Contratos (v1.0)

Este documento define o contrato de comunicação entre o frontend (React/Zustand) e o backend (Node.js/Express) para as 13 entidades do banco de dados PostgreSQL.

---

## 1. Convenções Gerais

* **URL Base:** `/api`
* **Formato de Dados:** `application/json` (UTF-8)
* **Padrão de Nomenclatura:**
  * URLs em `kebab-case` no plural (ex.: `/api/atas-registro-precos`);
  * Campos JSON em `snake_case`, espelhando exatamente as colunas do PostgreSQL.
* **Formato de Datas:** Strings ISO `YYYY-MM-DD` no tráfego da API (alinhado ao `pg.types.setTypeParser` configurado no banco).
* **Padrão de Rotas Aninhadas vs. Diretas (Entidades Filhas):**
  * Para **listar** e **criar** registros dependentes de um pai, usam-se rotas aninhadas (ex.: `GET /api/contratos/:contratoId/alteracoes` e `POST /api/contratos/:contratoId/alteracoes`).
  * Para **editar** e **excluir** um registro específico pelo seu próprio `id`, usam-se rotas diretas (ex.: `PUT /api/alteracoes-contratuais/:id` e `DELETE /api/alteracoes-contratuais/:id`).

### Códigos HTTP e Formato de Erro (`RNF-02`)

| Código HTTP | Situação | Corpo da Resposta |
|---|---|---|
| `200 OK` | Leitura (`GET`) ou atualização (`PUT`/`PATCH`) bem-sucedida | Objeto ou array JSON |
| `201 Created` | Criação (`POST`) bem-sucedida | Objeto recém-criado (com `id`) |
| `204 No Content` | Exclusão (`DELETE`) bem-sucedida | Corpo vazio |
| `400 Bad Request` | Campo obrigatório ausente ou regra de negócio violada (`RN-02`, `RN-03`, `RN-04`) | `{ "error": "Mensagem clara" }` |
| `404 Not Found` | ID informado não existe no banco | `{ "error": "Registro não encontrado" }` |
| `409 Conflict` | Violação de `UNIQUE` (`23505`) ou tentativa de excluir pai com vínculos (`23503`) | `{ "error": "Mensagem amigável" }` |
| `500 Internal Server Error` | Erro inesperado no servidor/banco | `{ "error": "Erro interno do servidor" }` |

---

## 2. Mapa de Endpoints por Módulo

### Módulo A — Estrutura Organizacional

#### 1. Secretarias (`secretarias`) — `RF-01`, `RF-03`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/secretarias` | Lista todas as secretarias (com nome do secretário titular via `LEFT JOIN`) |
| `GET` | `/api/secretarias/:id` | Retorna detalhes de uma secretaria |
| `POST` | `/api/secretarias` | Cria uma nova secretaria |
| `PUT` | `/api/secretarias/:id` | Atualiza dados da secretaria (incluindo `secretario_titular_id`) |
| `DELETE` | `/api/secretarias/:id` | Remove secretaria (bloqueia com `409` se houver servidores ou processos) |

* **Obrigatórios:** `nome_secretaria`, `sigla_secretaria`
* **Opcionais:** `secretario_titular_id`
* **Unicidade (`RN-01`):** `nome_secretaria` e `sigla_secretaria`

#### 2. Servidores (`servidores`) — `RF-02`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/servidores` | Lista servidores (suporta filtro `?secretaria_id=1`, retorna sigla da secretaria via `JOIN`) |
| `GET` | `/api/servidores/:id` | Retorna detalhes de um servidor |
| `POST` | `/api/servidores` | Cadastra novo servidor |
| `PUT` | `/api/servidores/:id` | Atualiza dados do servidor |
| `DELETE` | `/api/servidores/:id` | Remove servidor (bloqueia com `409` se houver designações ou ocorrências) |

* **Obrigatórios:** `secretaria_id`, `nome`, `registro_funcional`, `cargo`
* **Opcionais:** `email`, `telefone`
* **Unicidade (`RN-01`):** `registro_funcional`

---

### Módulo B — Fornecedores e Regularidade Documental

#### 3. Fornecedores (`fornecedores`) — `RF-04`, `RF-05`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/fornecedores` | Lista fornecedores (suporta `?status=Ativo&busca=...`) |
| `GET` | `/api/fornecedores/:id` | Retorna detalhes de um fornecedor |
| `POST` | `/api/fornecedores` | Cadastra novo fornecedor |
| `PUT` | `/api/fornecedores/:id` | Atualiza dados do fornecedor |
| `DELETE` | `/api/fornecedores/:id` | Remove fornecedor (bloqueia com `409` se houver contratos, atas, AFs ou documentos) |

* **Obrigatórios:** `tipo`, `razao_social`, `cpf_cnpj`, `cidade`, `estado`
* **Opcionais:** `nome_fantasia`, `inscricao_estadual`, `inscricao_municipal`, `cep`, `logradouro`, `numero`, `bairro`, `email`, `telefone`, `representante_legal`, `status` (padrão: `'Ativo'`)
* **Unicidade (`RN-01`):** `cpf_cnpj`

#### 4. Catálogo de Documentos (`documentos`) — `RF-06`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/documentos` | Lista o catálogo de certidões/documentos (suporta `?esfera=...`) |
| `GET` | `/api/documentos/:id` | Retorna um item do catálogo |
| `POST` | `/api/documentos` | Cadastra novo tipo de documento |
| `PUT` | `/api/documentos/:id` | Atualiza item do catálogo |
| `DELETE` | `/api/documentos/:id` | Remove item do catálogo (bloqueia com `409` se vinculado a fornecedores) |

* **Obrigatórios:** `nome_documento`, `categoria`, `esfera`
* **Opcionais:** `cidade`, `estado`, `fonte_website` *(validar `estado`/`cidade` conforme `RN-07`)*

#### 5. Documentos dos Fornecedores (`documentos_fornecedores`) — `RF-07`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/fornecedores/:fornecedorId/documentos` | Lista certidões vinculadas ao fornecedor (com dados do catálogo via `JOIN`) |
| `POST` | `/api/fornecedores/:fornecedorId/documentos` | Vincula nova certidão ao fornecedor |
| `PUT` | `/api/documentos-fornecedores/:id` | Atualiza datas, URL ou status da certidão |
| `DELETE` | `/api/documentos-fornecedores/:id` | Remove vínculo documental |

* **Obrigatórios:** `documento_id`, `emissao`, `validade` *(além de `fornecedor_id` vindo da rota)*
* **Opcionais:** `arquivo_url`, `status` (padrão: `'Válido'`)
* **Validação:** `validade` igual ou posterior a `emissao` (`RN-02`)

---

### Módulo C — Fluxo Licitatório

#### 6. Processos Administrativos (`processos`) — `RF-08`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/processos` | Lista processos (com sigla da secretaria requisitante via `JOIN`) |
| `GET` | `/api/processos/:id` | Retorna detalhes de um processo |
| `POST` | `/api/processos` | Cadastra novo processo |
| `PUT` | `/api/processos/:id` | Atualiza dados do processo |
| `DELETE` | `/api/processos/:id` | Remove processo (bloqueia com `409` se houver procedimentos vinculados) |

* **Obrigatórios:** `numero`, `ano`, `secretaria_requisitante_id`, `assunto`, `data_abertura`
* **Opcionais:** `status` (padrão: `'Em Andamento'`), `link_sistema_eletronico`

#### 7. Procedimentos Licitatórios (`procedimentos`) — `RF-09`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/procedimentos` | Lista todos os procedimentos (suporta `?processo_id=1`) |
| `GET` | `/api/processos/:processoId/procedimentos` | Lista procedimentos vinculados a um processo específico |
| `GET` | `/api/procedimentos/:id` | Retorna detalhes de um procedimento |
| `POST` | `/api/procedimentos` | Cadastra novo procedimento |
| `PUT` | `/api/procedimentos/:id` | Atualiza dados do procedimento |
| `DELETE` | `/api/procedimentos/:id` | Remove procedimento (bloqueia com `409` se houver atas, contratos ou AFs) |

* **Obrigatórios:** `processo_id`, `numero`, `ano`, `modalidade`, `objeto`
* **Opcionais:** `status` (padrão: `'Em Andamento'`), `data_homologacao`, `link_pncp`

---

### Módulo D — Execução Contratual e Fornecimento

#### 8. Atas de Registro de Preços (`atas_registro_precos`) — `RF-10`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/atas-registro-precos` | Lista atas (com razão social do fornecedor e número do procedimento via `JOIN`) |
| `GET` | `/api/atas-registro-precos/:id` | Retorna detalhes de uma ata |
| `POST` | `/api/atas-registro-precos` | Cadastra nova ata |
| `PUT` | `/api/atas-registro-precos/:id` | Atualiza dados da ata |
| `DELETE` | `/api/atas-registro-precos/:id` | Remove ata (bloqueia com `409` se houver contratos ou AFs vinculados) |

* **Obrigatórios:** `numero`, `ano`, `objeto`, `fornecedor_id`, `procedimento_id`, `data_assinatura`, `data_validade`
* **Opcionais:** `status` (padrão: `'Vigente'`)
* **Validação:** `data_validade` igual ou posterior a `data_assinatura` (`RN-02`)

#### 9. Contratos (`contratos`) — `RF-11`, `RF-12`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/contratos` | Lista contratos com dados de fornecedor/procedimento (suporta `?status=...&busca=...`) |
| `GET` | `/api/contratos/:id` | Retorna detalhes do contrato **incluindo `valor_atualizado` e `termino_atualizado`** (`RN-05`) |
| `POST` | `/api/contratos` | Cadastra novo contrato |
| `PUT` | `/api/contratos/:id` | Atualiza dados do contrato |
| `DELETE` | `/api/contratos/:id` | Remove contrato (bloqueia com `409` se houver aditivos, gestão, ocorrências ou AFs) |

* **Obrigatórios:** `numero`, `ano`, `objeto`, `fornecedor_id`, `procedimento_id`, `valor_global`, `data_de_assinatura`, `data_de_termino`
* **Opcionais:** `ata_id`, `status` (padrão: `'Ativo'`), `prorrogavel` (`0` ou `1`, padrão: `0`)
* **Validações:** `valor_global` maior que 0 (`RN-03`) e `data_de_termino` igual ou posterior a `data_de_assinatura` (`RN-02`)

#### 10. Autorizações de Fornecimento (`autorizacoes_de_fornecimento`) — `RF-13`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/autorizacoes-fornecimento` | Lista AFs (suporta `?contrato_id=...&ata_id=...&fornecedor_id=...`) |
| `GET` | `/api/autorizacoes-fornecimento/:id` | Retorna detalhes de uma AF |
| `POST` | `/api/autorizacoes-fornecimento` | Emite nova AF |
| `PUT` | `/api/autorizacoes-fornecimento/:id` | Atualiza dados da AF |
| `DELETE` | `/api/autorizacoes-fornecimento/:id` | Remove AF |

* **Obrigatórios:** `numero`, `ano`, `fornecedor_id`, `objeto`, `valor_total`, `data_emissao`, `prazo_entrega_dias` + **ao menos um** entre `contrato_id`, `ata_id` ou `procedimento_id` (`RN-04`)
* **Opcionais:** `status` (padrão: `'Emitida'`)
* **Validações:** `valor_total` e `prazo_entrega_dias` maiores que 0 (`RN-03`)

---

### Módulo E — Acompanhamento e Fiscalização Contratual

#### 11. Alterações Contratuais (`alteracoes_contratuais`) — `RF-14`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/contratos/:contratoId/alteracoes` | Lista aditivos e apostilamentos do contrato ordenados por `data_assinatura` |
| `POST` | `/api/contratos/:contratoId/alteracoes` | Registra nova alteração contratual |
| `PUT` | `/api/alteracoes-contratuais/:id` | Atualiza alteração contratual |
| `DELETE` | `/api/alteracoes-contratuais/:id` | Remove alteração contratual |

* **Obrigatórios:** `tipo`, `data_assinatura`, `justificativa` *(além de `contrato_id` vindo da rota)*
* **Opcionais:** `acrescimo_prazo_dias` (padrão: `0`), `valor_acrescimo` (padrão: `0.00`), `valor_supressao` (padrão: `0.00`)
* **Validação:** Nenhum valor de prazo ou monetário pode ser negativo (`RN-03`)

#### 12. Gestão e Fiscalização (`gestao`) — `RF-15`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/contratos/:contratoId/gestao` | Lista gestores e fiscais designados (com nome, cargo e registro do servidor via `JOIN`) |
| `POST` | `/api/contratos/:contratoId/gestao` | Registra nova designação de servidor no contrato |
| `PUT` | `/api/gestao/:id` | Atualiza designação (ex.: encerrar vigência preenchendo `data_fim`) |
| `DELETE` | `/api/gestao/:id` | Remove designação |

* **Obrigatórios:** `servidor_id`, `papel`, `portaria_designacao`, `data_inicio` *(além de `contrato_id` vindo da rota)*
* **Opcionais:** `titularidade` (padrão: `'Titular'`), `data_fim`
* **Validação:** Se `data_fim` for informada, deve ser igual ou posterior a `data_inicio` (`RN-02`)

#### 13. Ocorrências de Contrato (`ocorrencias_contrato`) — `RF-16`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/contratos/:contratoId/ocorrencias` | Lista ocorrências do contrato (com nome do servidor relator via `JOIN`) |
| `POST` | `/api/contratos/:contratoId/ocorrencias` | Registra nova ocorrência |
| `PUT` | `/api/ocorrencias-contrato/:id` | Atualiza ocorrência (ex.: registrar `resposta_fornecedor` e mudar `status`) |
| `DELETE` | `/api/ocorrencias-contrato/:id` | Remove ocorrência |

* **Obrigatórios:** `servidor_id`, `data_ocorrencia`, `titulo_ocorrencia`, `descricao` *(além de `contrato_id` vindo da rota)*
* **Opcionais:** `gravidade` (padrão: `'Leve'`), `prazo_regularizacao`, `status` (padrão: `'Pendente'`), `resposta_fornecedor`, `anexo_url`
* **Validação:** Se `prazo_regularizacao` for informado, deve ser igual ou posterior a `data_ocorrencia` (`RN-02`)

---

## 3. Exemplos de Contratos JSON

### Exemplo 1 — Criação de Contrato (`POST /api/contratos`)

**Request:**
```json
{
  "numero": "042",
  "ano": 2026,
  "objeto": "Prestação de serviços de manutenção preventiva de ar-condicionado",
  "fornecedor_id": 3,
  "procedimento_id": 7,
  "ata_id": null,
  "status": "Ativo",
  "valor_global": 120000.00,
  "prorrogavel": 1,
  "data_de_assinatura": "2026-03-01",
  "data_de_termino": "2027-02-28"
}
```

**Response (`201 Created`):**
```json
{
  "id": 15,
  "ata_id": null,
  "numero": "042",
  "ano": 2026,
  "objeto": "Prestação de serviços de manutenção preventiva de ar-condicionado",
  "fornecedor_id": 3,
  "procedimento_id": 7,
  "status": "Ativo",
  "valor_global": 120000,
  "prorrogavel": 1,
  "data_de_assinatura": "2026-03-01",
  "data_de_termino": "2027-02-28",
  "criado_em": "2026-11-24 23:10:00",
  "atualizado_em": "2026-11-24 23:10:00"
}
```

### Exemplo 2 — Detalhe de Contrato com Recálculo (`GET /api/contratos/15`)

**Response (`200 OK`):**
```json
{
  "id": 15,
  "numero": "042",
  "ano": 2026,
  "objeto": "Prestação de serviços de manutenção preventiva de ar-condicionado",
  "fornecedor_id": 3,
  "fornecedor_razao_social": "Clima Litoral Serviços Ltda",
  "procedimento_id": 7,
  "ata_id": null,
  "status": "Ativo",
  "valor_global": 120000,
  "valor_atualizado": 135000,
  "prorrogavel": 1,
  "data_de_assinatura": "2026-03-01",
  "data_de_termino": "2027-02-28",
  "termino_atualizado": "2027-08-27"
}
```

### Exemplo 3 — Registro de Alteração Contratual (`POST /api/contratos/15/alteracoes`)

**Request:**
```json
{
  "tipo": "Aditivo Misto",
  "data_assinatura": "2026-10-15",
  "acrescimo_prazo_dias": 180,
  "valor_acrescimo": 15000.00,
  "valor_supressao": 0.00,
  "justificativa": "Prorrogação de vigência e acréscimo quantitativo para novos equipamentos instalados."
}
```

**Response (`201 Created`):**
```json
{
  "id": 4,
  "contrato_id": 15,
  "tipo": "Aditivo Misto",
  "data_assinatura": "2026-10-15",
  "acrescimo_prazo_dias": 180,
  "valor_acrescimo": 15000,
  "valor_supressao": 0,
  "justificativa": "Prorrogação de vigência e acréscimo quantitativo para novos equipamentos instalados.",
  "criado_em": "2026-11-24 23:15:00",
  "atualizado_em": "2026-11-24 23:15:00"
}
```

### Exemplo 4 — Erro de Regra de Negócio (`POST /api/autorizacoes-fornecimento`)

**Response (`400 Bad Request`):**
```json
{
  "error": "A Autorização de Fornecimento deve estar vinculada a pelo menos um Contrato, Ata de Registro de Preços ou Procedimento."
}
```

### Exemplo 5 — Erro de Integridade Referencial (`DELETE /api/fornecedores/3`)

**Response (`409 Conflict`):**
```json
{
  "error": "Não é possível excluir este fornecedor pois existem registros vinculados a ele."
}
```