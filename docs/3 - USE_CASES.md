# Casos de Uso e Histórias de Usuário — Gestão de Contratos (v1.0)

Este documento descreve como os usuários interagem com o sistema **Gestão de Contratos**, mapeando fluxos principais, caminhos alternativos e tratamento de exceções.

* **Casos de Uso Detalhados (`UC-01` a `UC-06`):** Cobrem os fluxos com maior complexidade de negócio, integrações externas, cálculos derivados ou restrições de integridade referencial.
* **Histórias de Usuário (`US-01` a `US-08`):** Cobrem as operações CRUD mais diretas com critérios objetivos de aceite.

---

## 1. Atores do Sistema

Na Versão 1.0 (sem módulo de autenticação/RBAC), todas as funcionalidades ficam acessíveis em um único perfil operacional, dividido conceitualmente em dois papéis de domínio:

* **Usuário Administrativo:** Responsável pelo cadastro de estrutura organizacional, fornecedores, catálogo documental, processos, procedimentos, atas, contratos e autorizações de fornecimento.
* **Gestor / Fiscal de Contrato:** Responsável pelo acompanhamento da execução contratual (aditivos, designações e ocorrências) dentro da tela de detalhes do contrato.

---

## 2. Casos de Uso Detalhados (Fluxos Críticos)

### UC-01 — Cadastrar Fornecedor com Integração IBGE
* **Requisitos relacionados:** `RF-04`, `RF-05`, `RN-01`, `RNF-02`, `RNF-04`
* **Ator principal:** Usuário Administrativo
* **Pré-condições:** O usuário acessa a tela de Fornecedores e aciona a opção "Novo Fornecedor".

**Fluxo Principal:**
1. O frontend carrega o formulário e consulta a API de Localidades do IBGE para popular o campo `estado` (UFs).
2. O usuário preenche os dados obrigatórios (`tipo`, `razao_social`, `cpf_cnpj`) e seleciona um `estado`.
3. Ao selecionar o `estado`, o frontend consulta os municípios daquela UF na API do IBGE e habilita o campo `cidade`.
4. O usuário seleciona a `cidade`, preenche os campos opcionais desejados (nome fantasia, endereço, contato, representante legal) e clica em "Salvar".
5. O frontend dispara `POST /api/fornecedores` via Zustand store.
6. O `fornecedorService` valida os campos obrigatórios e chama o `fornecedorRepository` para inserir o registro no PostgreSQL (com `status` padrão `'Ativo'`).
7. A API retorna `201 Created` com o registro criado.
8. A store atualiza a lista local imediatamente e a interface exibe confirmação de sucesso.

**Fluxos Alternativos:**
* **FA-01 (Troca de Estado):** Se o usuário alterar o `estado` após já ter escolhido uma `cidade`, o frontend limpa o campo `cidade` atual e recarrega a lista da nova UF.

**Fluxos de Exceção:**
* **FE-01 (CPF/CNPJ duplicado):** O PostgreSQL dispara violação de unicidade (`23505`). A API retorna `409 Conflict` com mensagem clara (`"Já existe um fornecedor cadastrado com este CPF/CNPJ"`). O formulário mantém os dados preenchidos e exibe o alerta ao usuário.
* **FE-02 (Indisponibilidade da API do IBGE):** Caso a requisição ao IBGE falhe ou exceda o tempo limite, a interface exibe um aviso discreto e permite tentar recarregar ou digitar UF/cidade manualmente, sem travar o formulário.
* **FE-03 (Campos obrigatórios ausentes):** O frontend impede o envio ou a API retorna `400 Bad Request` indicando os campos pendentes.

**Pós-condições:** Novo fornecedor persistido no banco e disponível nos seletores de Atas, Contratos e Autorizações de Fornecimento.

---

### UC-02 — Vincular e Acompanhar Documentos de Regularidade do Fornecedor
* **Requisitos relacionados:** `RF-07`, `RN-02`, `RNF-05`, `RNF-06`
* **Ator principal:** Usuário Administrativo
* **Pré-condições:** Existe ao menos um registro em `fornecedores` e ao menos um documento cadastrado no catálogo (`documentos`). O usuário está na tela de detalhes do fornecedor, na aba "Documentos".

**Fluxo Principal:**
1. O usuário clica em "Adicionar Documento".
2. O sistema exibe um modal/formulário carregando os tipos disponíveis em `documentos` (`documento_id`).
3. O usuário seleciona o documento, informa `emissao`, `validade`, `status` e, opcionalmente, `arquivo_url`, e confirma o envio.
4. O frontend envia `POST /api/fornecedores/:fornecedorId/documentos` (ou `POST /api/documentos-fornecedores`).
5. O backend valida a existência do `fornecedor_id`, do `documento_id` e verifica se `validade` é igual ou posterior a `emissao` (`RN-02`).
6. O registro é salvo e a API retorna `201 Created`.
7. A aba "Documentos" é atualizada e exibe o novo item com datas em `DD/MM/AAAA` e indicador visual (ex.: *Chip* verde para válido, amarelo para vencimento próximo, vermelho para vencido com base na data atual).

**Fluxos de Exceção:**
* **FE-01 (Data de validade anterior à emissão):** O service rejeita a operação com `400 Bad Request` (`"A data de validade não pode ser anterior à data de emissão"`).
* **FE-02 (Catálogo vazio):** Se não houver documentos cadastrados em `documentos`, o seletor exibe mensagem orientando o cadastro prévio no Catálogo de Documentos.

**Pós-condições:** Certidão vinculada ao fornecedor e visível na aba de regularidade documental.

---

### UC-03 — Cadastrar Contrato Vinculado ao Fluxo Licitatório
* **Requisitos relacionados:** `RF-11`, `RN-02`, `RN-03`, `RNF-02`, `RNF-04`
* **Ator principal:** Usuário Administrativo
* **Pré-condições:** Existem registros prévios em `fornecedores` e `procedimentos` (e, opcionalmente, em `atas_registro_precos`).

**Fluxo Principal:**
1. Na tela de Contratos, o usuário aciona "Novo Contrato".
2. O formulário carrega as listas de `fornecedores`, `procedimentos` e `atas_registro_precos` para seleção.
3. O usuário informa `numero`, `ano`, `objeto`, seleciona `fornecedor_id` e `procedimento_id`, opcionalmente vincula `ata_id`, define `valor_global`, marca se é `prorrogavel`, informa `data_de_assinatura`, `data_de_termino` e `status`.
4. O usuário envia o formulário (`POST /api/contratos`).
5. O `contratoService` valida:
   * Campos obrigatórios preenchidos;
   * `valor_global` maior que zero (`RN-03`);
   * `data_de_termino` igual ou posterior a `data_de_assinatura` (`RN-02`);
   * Existência das chaves estrangeiras informadas.
6. O `contratoRepository` persiste o contrato e retorna `201 Created`.
7. A `TabelaContratos` é atualizada via Zustand store com o novo registro.

**Fluxos Alternativos:**
* **FA-01 (Contrato originado de ARP):** Ao selecionar uma `ata_id`, a interface pode pré-preencher automaticamente `fornecedor_id` e `procedimento_id` correspondentes à ata selecionada, reduzindo erros de digitação.

**Fluxos de Exceção:**
* **FE-01 (Valor inválido):** Se `valor_global` for menor ou igual a zero, a API retorna `400 Bad Request`.
* **FE-02 (Datas invertidas):** Se `data_de_termino` for anterior a `data_de_assinatura`, a API retorna `400 Bad Request`.
* **FE-03 (Referência inexistente):** Se um ID de fornecedor, procedimento ou ata não existir mais no banco, a API retorna `400 Bad Request` ou `404 Not Found` com mensagem específica.

**Pós-condições:** Contrato criado e disponível para acompanhamento de aditivos, fiscalização, ocorrências e emissão de AFs.

---

### UC-04 — Registrar Alteração Contratual com Recálculo Dinâmico
* **Requisitos relacionados:** `RF-14`, `RN-03`, `RN-05`, `RNF-04`, `RNF-06`
* **Ator principal:** Gestor / Fiscal de Contrato
* **Pré-condições:** Existe um contrato cadastrado e o usuário está na tela de Detalhes do Contrato, na aba "Alterações Contratuais".

**Fluxo Principal:**
1. O cabeçalho da tela de Detalhes do Contrato exibe o **Valor Global Original**, o **Valor Atualizado**, o **Término Original** e o **Término Atualizado**.
2. O usuário clica em "Nova Alteração Contratual".
3. O usuário preenche `tipo` (ex.: Aditivo de Prazo, Aditivo de Valor, Aditivo Misto, Apostilamento), `data_assinatura`, `acrescimo_prazo_dias`, `valor_acrescimo`, `valor_supressao` e `justificativa`.
4. O frontend envia `POST /api/contratos/:contratoId/alteracoes`.
5. O backend valida que `acrescimo_prazo_dias`, `valor_acrescimo` e `valor_supressao` não são negativos e que a `justificativa` está preenchida (`RN-03`).
6. A alteração é persistida em `alteracoes_contratuais` e a API retorna `201 Created`.
7. O sistema recalcula imediatamente (no backend ou via estado sincronizado):
   * `valor_atualizado = valor_global + SOMA(valor_acrescimo) - SOMA(valor_supressao)`
   * `termino_atualizado = data_de_termino + SOMA(acrescimo_prazo_dias)`
8. A lista de alterações e os indicadores do cabeçalho do contrato são atualizados sem recarregar a página.

**Fluxos Alternativos:**
* **FA-01 (Edição ou Exclusão de Alteração):** Ao editar ou excluir uma alteração existente, o sistema refaz exatamente o mesmo recálculo do valor e da data de término atualizados.

**Fluxos de Exceção:**
* **FE-01 (Valores negativos ou supressão excessiva):** Se qualquer valor financeiro ou de prazo for negativo, ou se a supressão resultar em valor atualizado negativo, a API retorna `400 Bad Request`.

**Pós-condições:** Histórico de alterações atualizado e resumo financeiro/temporal do contrato refletindo o impacto real.

---

### UC-05 — Emitir Autorização de Fornecimento (AF) com Origem Obrigatória
* **Requisitos relacionados:** `RF-13`, `RN-03`, `RN-04`, `RNF-02`
* **Ator principal:** Usuário Administrativo
* **Pré-condições:** Existe um `fornecedor` cadastrado e ao menos um documento de origem válido (`contrato`, `ata_registro_precos` ou `procedimento`).

**Fluxo Principal:**
1. O usuário acessa a tela de Autorizações de Fornecimento (ou a aba correspondente dentro de um Contrato/ARP) e clica em "Nova AF".
2. O usuário seleciona o tipo de origem (Contrato, Ata de Registro de Preços ou Procedimento Direto) e escolhe o registro correspondente (`contrato_id`, `ata_id` ou `procedimento_id`).
3. O usuário confirma ou seleciona o `fornecedor_id`, preenche `numero`, `ano`, `objeto`, `valor_total`, `data_emissao`, `prazo_entrega_dias` e `status`.
4. O frontend envia `POST /api/autorizacoes-fornecimento`.
5. O backend valida `RN-04` (ao menos um entre `contrato_id`, `ata_id` ou `procedimento_id` deve estar preenchido) e `RN-03` (`valor_total` e `prazo_entrega_dias` maiores que zero).
6. O registro é salvo e a API retorna `201 Created`.
7. A listagem é atualizada com a nova AF.

**Fluxos de Exceção:**
* **FE-01 (Nenhuma origem informada):** Se `contrato_id`, `ata_id` e `procedimento_id` chegarem todos nulos/vazios, o service retorna `400 Bad Request` (`"A Autorização de Fornecimento deve estar vinculada a um Contrato, Ata ou Procedimento"`).
* **FE-02 (Valor ou prazo inválido):** Se `valor_total` ou `prazo_entrega_dias` for menor ou igual a zero, a API retorna `400 Bad Request`.

**Pós-condições:** AF registrada e rastreável até seu contrato, ata ou procedimento de origem.

---

### UC-06 — Excluir Registro com Proteção de Integridade Referencial
* **Requisitos relacionados:** `RN-06`, `RNF-02`, `RNF-05`
* **Ator principal:** Usuário Administrativo ou Gestor / Fiscal
* **Pré-condições:** O usuário visualiza um registro existente em qualquer tabela do sistema (ex.: `secretarias`, `fornecedores`, `processos`, `contratos`).

**Fluxo Principal:**
1. O usuário clica no botão "Excluir" de um registro.
2. A interface abre um diálogo de confirmação (Material UI Dialog) informando claramente qual registro será removido.
3. O usuário confirma a exclusão.
4. O frontend envia `DELETE /api/<recurso>/:id`.
5. O backend tenta excluir o registro no PostgreSQL.
6. Não havendo registros filhos dependentes, o banco remove a linha e a API retorna `200 OK` ou `204 No Content`.
7. A store remove o item da lista na interface e exibe feedback de sucesso.

**Fluxos Alternativos:**
* **FA-01 (Cancelamento):** O usuário clica em "Cancelar" no diálogo; nenhuma requisição é enviada ao servidor.

**Fluxos de Exceção:**
* **FE-01 (Registro possui vínculos ativos — Erro PostgreSQL `23503`):** O PostgreSQL bloqueia a exclusão por violação de chave estrangeira. O middleware/tratamento de erros intercepta o código `23503` e retorna `409 Conflict` com mensagem amigável (ex.: `"Não é possível excluir este fornecedor pois existem contratos ou atas vinculados a ele"`). A interface exibe o alerta e mantém o registro intacto.
* **FE-02 (Registro já inexistente):** Se o ID não for encontrado no banco, a API retorna `404 Not Found` e o frontend sincroniza a lista.

**Pós-condições:** Registro removido apenas quando seguro, preservando a integridade histórica do banco de dados.

---

## 3. Histórias de Usuário e Critérios de Aceite (Demais Módulos)

### US-01 — Gestão de Secretarias e Secretário Titular (`RF-01`, `RF-03`, `RN-01`)
> **Como** usuário administrativo, **quero** cadastrar, editar, excluir secretarias e designar seu secretário titular **para** organizar a estrutura municipal que requisita processos e lota servidores.

**Critérios de Aceite:**
* [ ] Permite criar, listar, editar e excluir registros em `secretarias`.
* [ ] Impede `nome_secretaria` ou `sigla_secretaria` duplicados (`409 Conflict`).
* [ ] Permite selecionar ou limpar o `secretario_titular_id` a partir dos servidores já cadastrados (campo opcional na criação inicial).

### US-02 — Gestão de Servidores (`RF-02`, `RN-01`)
> **Como** usuário administrativo, **quero** manter o cadastro de servidores vinculados às suas secretarias **para** designá-los como gestores, fiscais ou relatores de ocorrências.

**Critérios de Aceite:**
* [ ] Exige seleção de uma `secretaria_id` válida ao criar ou editar um servidor.
* [ ] Impede `registro_funcional` duplicado (`409 Conflict`).
* [ ] Exibe o nome/sigla da secretaria na listagem (via `JOIN` no repositório).

### US-03 — Catálogo de Documentos (`RF-06`, `RN-07`)
> **Como** usuário administrativo, **quero** gerenciar um catálogo padronizado de certidões e documentos exigidos **para** reutilizá-los no controle de regularidade de todos os fornecedores.

**Critérios de Aceite:**
* [ ] Permite CRUD completo em `documentos` com `nome_documento`, `categoria`, `esfera` e `fonte_website`.
* [ ] Exibe/habilita os campos `estado` e `cidade` (via IBGE) conforme a `esfera` selecionada (Estadual exige UF; Municipal exige UF e cidade; Federal mantém ambos opcionais).

### US-04 — Processos Administrativos e Procedimentos Licitatórios (`RF-08`, `RF-09`)
> **Como** usuário administrativo, **quero** registrar processos administrativos e vincular a eles seus procedimentos licitatórios ou contratações diretas **para** rastrear a origem legal de cada ata e contrato.

**Critérios de Aceite:**
* [ ] `processos` exige `secretaria_requisitante_id`, `numero`, `ano`, `assunto` e `data_abertura`, exibindo `link_sistema_eletronico` como link clicável quando informado.
* [ ] `procedimentos` exige vínculo com um `processo_id` existente, permitindo visualização tanto em página própria quanto em uma aba dentro dos detalhes do Processo.
* [ ] Exibe `link_pncp` como link externo quando preenchido.

### US-05 — Atas de Registro de Preços (`RF-10`, `RN-02`)
> **Como** usuário administrativo, **quero** gerenciar Atas de Registro de Preços (ARPs) vinculadas a procedimentos e fornecedores **para** controlar sua vigência e emitir contratos ou AFs derivados.

**Critérios de Aceite:**
* [ ] Exige `fornecedor_id` e `procedimento_id` válidos.
* [ ] Bloqueia cadastro/edição caso `data_validade` seja anterior a `data_assinatura` (`400 Bad Request`).

### US-06 — Busca e Filtros na Tabela de Contratos (`RF-12`, `RNF-06`)
> **Como** gestor de contratos, **quero** pesquisar e filtrar a `TabelaContratos` por texto, status e vencimento **para** localizar rapidamente contratos ativos ou próximos do término.

**Critérios de Aceite:**
* [ ] Permite busca textual combinada por número, objeto ou razão social do fornecedor.
* [ ] Permite filtrar por `status` (ex.: Ativo, Encerrado, Suspenso) e visualizar datas em `DD/MM/AAAA` e valores em `R$`.
* [ ] Exibe estado vazio claro quando nenhum contrato corresponde aos filtros aplicados.

### US-07 — Designação de Gestores e Fiscais do Contrato (`RF-15`, `RN-02`)
> **Como** gestor, **quero** registrar e atualizar os servidores designados como gestores e fiscais na tela de detalhes de um contrato **para** manter o histórico formal de portarias e vigências.

**Critérios de Aceite:**
* [ ] Opera como aba integrada dentro dos Detalhes do Contrato (`contrato_id` preenchido automaticamente).
* [ ] Permite selecionar `servidor_id`, `papel` (Gestor/Fiscal), `titularidade` (Titular/Suplente), `portaria_designacao`, `data_inicio` e `data_fim` (opcional).
* [ ] Valida que `data_fim`, quando informada, é igual ou posterior a `data_inicio`.

### US-08 — Registro e Acompanhamento de Ocorrências (`RF-16`, `RN-02`)
> **Como** fiscal de contrato, **quero** registrar ocorrências, definir gravidade/prazo e anotar a resposta do fornecedor dentro do contrato **para** documentar falhas de execução e eventuais regularizações.

**Critérios de Aceite:**
* [ ] Opera como aba integrada dentro dos Detalhes do Contrato (`contrato_id` automático).
* [ ] Exige `servidor_id` (quem registrou), `data_ocorrencia`, `titulo_ocorrencia`, `descricao`, `gravidade` e `status`.
* [ ] Valida que `prazo_regularizacao`, quando informado, é igual ou posterior a `data_ocorrencia`.
* [ ] Permite atualizar o `status` (ex.: Pendente → Resolvida) e registrar `resposta_fornecedor` e `anexo_url`.