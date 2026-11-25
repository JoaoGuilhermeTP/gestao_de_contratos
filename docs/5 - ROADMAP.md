# Roadmap de Desenvolvimento — Gestão de Contratos (v1.0)

Este roadmap organiza o desenvolvimento em **Milestones incrementais (fatias verticais)**, partindo da estabilização do código existente e avançando na ordem de dependência das chaves estrangeiras do banco de dados até atingir **100% de CRUD integrado para as 13 entidades**.

---

## Fluxo de Trabalho Recomendado (Git & GitHub)

1. Crie cada **Milestone** abaixo na aba *Issues → Milestones* do GitHub.
2. Transforme cada item `- [ ]` em uma **Issue** vinculada à respectiva Milestone e aos códigos de requisito (`RF-XX`, `RN-XX`, `RNF-XX`).
3. Trabalhe em **uma branch por Issue** a partir da `main`:
   * `fix/nome-curto` para correções de bugs;
   * `feat/nome-curto` para novas funcionalidades;
   * `chore/nome-curto` para documentação, limpeza e configuração.
4. Só considere uma Issue concluída quando **backend + store + UI + validação de erro** estiverem funcionando juntos e passando no `npm run lint`.

---

## Milestone 0 — Estabilização e Infraestrutura Base
**Objetivo:** Eliminar bugs existentes no código atual e padronizar o tratamento global de erros antes de expandir novas telas.

- [ ] **M0-01 — Middleware global de erros PostgreSQL (`RNF-02`, `RN-06`)**
  * Atualizar o error handler em `backend/server.js` para mapear códigos do PostgreSQL: `23505` (`409 Conflict` — duplicidade), `23503` (`409 Conflict` — registro com vínculos ativos na exclusão ou FK inexistente) e `22P02` (`400 Bad Request`).
  * Corrigir o script `"seed"` em `package.json` para `node backend/db/seed.js`.
- [ ] **M0-02 — Corrigir bugs críticos de Contratos (Backend e Frontend)**
  * Adicionar `await` em `atualizarContrato` e verificar existência da ata em `backend/services/contratoService.js`.
  * Corrigir `AdicionarContratoPage.jsx` (`ata.id === ataId`, `fornecedor.id === ata.fornecedor_id`, `disabled={Boolean(novoContrato.ata_id)}`, `errors.procedimento_id` e opção para desvincular ata).
  * Corrigir ordem do guard `if (!contrato)` em `ContratoPage.jsx`.
  * Padronizar `useContratoStore.js` para propagar erros da API (`throw new Error(...)`) e usar o objeto retornado pelo servidor no `PUT` (removendo estado morto `fornecedores: []`).
- [ ] **M0-03 — Corrigir bugs de filtros e tabela de Atas**
  * Proteger campos opcionais (`null`) contra `.toLowerCase()` em `TabelaFornecedores.jsx` e `TabelaServidores.jsx`, e usar *optional chaining* nas buscas por relacionamento (`.find(...)?.campo`).
  * Corrigir colunas de `TabelaAtas.jsx` (`data_assinatura` e `data_validade`, removendo `valor_global` inexistente na tabela).
  * Corrigir `backend/repositories/processoRepository.js` para executar `SELECT * FROM processos`.

---

## Milestone 1 — Módulo A: Estrutura Organizacional (`secretarias`, `servidores`)
**Objetivo:** Fechar 100% do CRUD de Secretarias e Servidores, estabelecendo o padrão limpo de páginas, formulários e confirmação de exclusão.

- [ ] **M1-01 — CRUD completo de Secretarias no Backend (`RF-01`, `RF-03`, `RN-01`)**
  * Implementar `findById`, `create`, `update` (incluindo `secretario_titular_id`) e `remove` em `secretariaRepository.js`, `secretariaService.js` e `routes/secretarias.js`.
- [ ] **M1-02 — CRUD completo de Secretarias no Frontend (`RF-01`, `RF-03`)**
  * Expandir `useSecretariaStore.js` com `addSecretaria`, `editarSecretaria` e `deletarSecretaria`.
  * Criar `SecretariasPage`, `SecretariaPage`, `AdicionarSecretariaPage`, `EditarSecretariaPage` (com `<select>` de `servidores` para `secretario_titular_id`) e adicionar link na `NavBar.jsx`.
- [ ] **M1-03 — Fechar pendências do CRUD de Servidores (`RF-02`, `UC-06`)**
  * Adicionar `GET /api/servidores/:id` no backend.
  * Substituir o `<input type="number">` de secretaria por `<select>` em `EditarServidorPage.jsx`.
  * Adicionar botão "Excluir" com confirmação e tratamento de erro `409` na `ServidorPage.jsx` e incluir filtro por secretaria na `TabelaServidores.jsx`.

---

## Milestone 2 — Módulo B: Fornecedores e Regularidade Documental (`fornecedores`, `documentos`, `documentos_fornecedores`)
**Objetivo:** Completar operações de edição e exclusão faltantes em Fornecedores, Catálogo de Documentos e Certidões do Fornecedor.

- [ ] **M2-01 — Completar CRUD de Fornecedores (`RF-04`, `RN-01`, `UC-06`)**
  * Adicionar validações de campos obrigatórios no `fornecedorService.js`, além de `GET /api/fornecedores/:id` e `DELETE /api/fornecedores/:id`.
  * Implementar `deletarFornecedor` em `useFornecedorStore.js` e botão "Excluir" com confirmação/tratamento de erro na `FornecedorPage.jsx`.
  * Ajustar ordem `EstadoSelect` → `MunicipioSelect` em `EditarFornecedorPage.jsx`.
- [ ] **M2-02 — Completar CRUD do Catálogo de Documentos (`RF-06`, `RN-07`)**
  * Implementar `GET /:id`, `PUT /:id` e `DELETE /:id` em `documentoRepository.js`, `documentoService.js` e `routes/documentos.js`.
  * Implementar `editarDocumento` e `deletarDocumento` em `useDocumentoStore.js`.
  * Criar página/ações de edição e exclusão na `DocumentosPage.jsx` e respeitar `RN-07` nos campos de UF/cidade conforme a esfera selecionada.
- [ ] **M2-03 — Completar CRUD de Documentos do Fornecedor (`RF-07`, `UC-02`, `RN-02`)**
  * Adicionar validação `validade >= emissao` no backend (`fornecedorService.js`) e endpoints `PUT /api/documentos-fornecedores/:id` e `DELETE /api/documentos-fornecedores/:id`.
  * Adicionar `editarDocumentoFornecedor` e `deletarDocumentoFornecedor` em `useDocumentoStore.js`.
  * Atualizar `DocumentosFornecedor.jsx` com formatação de datas (`formatDate`) e botões de editar e excluir.

---

## Milestone 3 — Módulo C: Fluxo Licitatório (`processos`, `procedimentos`)
**Objetivo:** Permitir gerenciar todo o fluxo pré-contratual (abertura do processo → licitação/contratação direta) com interface integrada.

- [ ] **M3-01 — CRUD completo de Processos Administrativos (`RF-08`, `US-04`)**
  * Implementar `findAll` (com `JOIN` ou dados da secretaria requisitante), `findById`, `create`, `update` e `remove` no backend (`processoRepository`, `processoService`, `routes/processos`).
  * Criar `useProcessoStore.js` (carregar também no `App.jsx`).
  * Criar `ProcessosPage`, `ProcessoPage` (com aba de procedimentos vinculados), `AdicionarProcessoPage`, `EditarProcessoPage` e adicionar link na `NavBar.jsx`.
- [ ] **M3-02 — CRUD completo de Procedimentos Licitatórios (`RF-09`, `US-04`)**
  * Implementar `findById`, `findByProcessoId`, `create`, `update` e `remove` no backend (`procedimentoRepository`, `procedimentoService`, `routes/procedimentos`).
  * Expandir `useProcedimentoStore.js` com `addProcedimento`, `editarProcedimento` e `deletarProcedimento`.
  * Criar `ProcedimentosPage`, `ProcedimentoPage`, `AdicionarProcedimentoPage`, `EditarProcedimentoPage` e vincular a listagem por processo dentro de `ProcessoPage`.

---

## Milestone 4 — Módulo D: Execução Contratual e Fornecimento (`atas_registro_precos`, `contratos`, `autorizacoes_de_fornecimento`)
**Objetivo:** Fechar 100% do CRUD de Atas, refinar Contratos e construir o módulo completo de Autorizações de Fornecimento (AF).

- [ ] **M4-01 — CRUD completo de Atas de Registro de Preços (`RF-10`, `US-05`, `RN-02`)**
  * Implementar `GET /api/atas/:id`, `POST /api/atas`, `PUT /api/atas/:id` e `DELETE /api/atas/:id` com validação `data_validade >= data_assinatura`.
  * Expandir `useAtaStore.js` com `addAta`, `editarAta` e `deletarAta`.
  * Criar `AtaPage`, `AdicionarAtaPage`, `EditarAtaPage`, ativar filtros na `TabelaAtas.jsx` e habilitar o botão "Adicionar Ata" em `AtasPage.jsx`.
- [ ] **M4-02 — Refinar Edição e Filtros de Contratos (`RF-11`, `RF-12`, `UC-03`)**
  * Atualizar `EditarContratoPage.jsx` para usar `<select>` em `ata_id`, `procedimento_id`, `status` e `prorrogavel`, com validação de formulário e `await` + exibição de erros da API.
  * Ativar filtro por procedimento e status na `TabelaContratos.jsx` e adicionar confirmação antes da exclusão (`UC-06`).
- [ ] **M4-03 — CRUD completo de Autorizações de Fornecimento (`RF-13`, `UC-05`, `RN-03`, `RN-04`)**
  * Criar `autorizacaoRepository.js`, `autorizacaoService.js` (validando origem obrigatória `contrato_id` OU `ata_id` OU `procedimento_id`, além de `valor_total > 0` e `prazo_entrega_dias > 0`) e `routes/autorizacoesFornecimento.js` (`/api/autorizacoes-fornecimento`).
  * Criar `useAutorizacaoStore.js` (carregar no `App.jsx`).
  * Criar `AutorizacoesPage`, `AutorizacaoPage`, `AdicionarAutorizacaoPage`, `EditarAutorizacaoPage`, adicionar link na `NavBar.jsx` e exibir AFs relacionadas dentro de `ContratoPage` e `AtaPage`.

---

## Milestone 5 — Módulo E: Acompanhamento e Fiscalização na Tela do Contrato (`alteracoes_contratuais`, `gestao`, `ocorrencias_contrato`)
**Objetivo:** Transformar `ContratoPage.jsx` no centro operacional do sistema com abas integradas (mesmo padrão visual de `FornecedorPage.jsx`).

- [ ] **M5-01 — Estrutura de Abas na `ContratoPage.jsx`**
  * Reutilizar o padrão `.supplier-tabs` na `ContratoPage.jsx` com 4 abas: **Alterações Contratuais**, **Gestão e Fiscalização**, **Ocorrências** e **Autorizações de Fornecimento**.
- [ ] **M5-02 — CRUD de Alterações Contratuais + Recálculo Dinâmico (`RF-14`, `UC-04`, `RN-03`, `RN-05`)**
  * Criar `alteracaoRepository.js`, `alteracaoService.js` e rotas (`GET/POST /api/contratos/:contratoId/alteracoes` e `PUT/DELETE /api/alteracoes-contratuais/:id`).
  * Atualizar `GET /api/contratos/:id` (ou estado da tela) para calcular e exibir **Valor Atualizado** e **Término Atualizado** no cabeçalho da `ContratoPage.jsx`.
  * Criar `useAlteracaoStore.js` e componente/formulários da aba de Alterações Contratuais.
- [ ] **M5-03 — CRUD de Gestão e Fiscalização (`RF-15`, `US-07`, `RN-02`)**
  * Criar `gestaoRepository.js`, `gestaoService.js` (validando `data_fim >= data_inicio` quando preenchida) e rotas (`GET/POST /api/contratos/:contratoId/gestao` e `PUT/DELETE /api/gestao/:id`).
  * Criar `useGestaoStore.js` e aba/formulários para designar, editar e remover gestores/fiscais no contrato.
- [ ] **M5-04 — CRUD de Ocorrências de Contrato (`RF-16`, `US-08`, `RN-02`)**
  * Criar `ocorrenciaRepository.js`, `ocorrenciaService.js` (validando `prazo_regularizacao >= data_ocorrencia`) e rotas (`GET/POST /api/contratos/:contratoId/ocorrencias` e `PUT/DELETE /api/ocorrencias-contrato/:id`).
  * Criar `useOcorrenciaStore.js` e aba/formulários para registrar ocorrências, definir gravidade/prazo, anotar `resposta_fornecedor` e atualizar status.

---

## Milestone 6 — Polimento Final de Portfólio (Release v1.0)
**Objetivo:** Garantir qualidade de entrega, limpeza do repositório e apresentação impecável para recrutadores.

- [ ] **M6-01 — Padronização de UI e Limpeza do Repositório**
  * Remover arquivos obsoletos (`src/mock/mockContratos.jsx`, `src/mock/mockFornecedores.jsx`) e imports não utilizados.
  * Atualizar `index.html` (`lang="pt-BR"`, `<title>Gestão de Contratos</title>`).
  * Revisar consistência de formatação de datas (`DD/MM/AAAA`), valores (`R$`), mensagens de estado vazio e confirmação em todas as ações de exclusão (`RNF-05`, `RNF-06`).
  * Garantir `npm run lint` e `npm run build` sem erros ou avisos.
- [ ] **M6-02 — Documentação Final e Tag `v1.0.0`**
  * Atualizar `README.md` com a arquitetura completa, lista atualizada das 13 entidades/rotas, prints da aplicação e links para a pasta `/docs` (`SCOPE.md`, `REQUIREMENTS.md`, `USE_CASES.md`, `API_SPEC.md`, `ROADMAP.md`).
  * Testar todo o fluxo ponta a ponta após rodar `npm run seed` e criar a release `v1.0.0` no GitHub.