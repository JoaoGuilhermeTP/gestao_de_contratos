# Especificação de Requisitos de Software — Gestão de Contratos (v1.0)

Este documento detalha os Requisitos Funcionais (RF), Regras de Negócio (RN) e Requisitos Não Funcionais (RNF) para a Versão 1.0 do sistema **Gestão de Contratos**, cobrindo a integração completa (CRUD) das 13 entidades do banco de dados PostgreSQL com a interface React.

---

## 1. Requisitos Funcionais (RF)

### Módulo A — Estrutura Organizacional
* **RF-01 (CRUD de Secretarias):** O sistema deve permitir cadastrar, listar, visualizar detalhes, editar e excluir secretarias municipais (`secretarias`), informando nome e sigla.
* **RF-02 (CRUD de Servidores):** O sistema deve permitir cadastrar, listar, visualizar, editar e excluir servidores públicos (`servidores`) vinculados a uma secretaria existente (`secretaria_id`), com nome, registro funcional, cargo, e-mail e telefone.
* **RF-03 (Vinculação de Secretário Titular):** O sistema deve permitir atribuir, alterar ou remover o secretário titular (`secretario_titular_id`) de uma secretaria a partir dos servidores cadastrados.

### Módulo B — Fornecedores e Regularidade Documental
* **RF-04 (CRUD de Fornecedores):** O sistema deve permitir cadastrar, listar, visualizar detalhes, editar e excluir fornecedores (`fornecedores`), incluindo tipo (PF/PJ), razão social, nome fantasia, CPF/CNPJ, inscrições, endereço completo, contatos, representante legal e status (`Ativo`/`Inativo`).
* **RF-05 (Seleção de Localidade via IBGE):** Nos formulários de `fornecedores` e `documentos`, o sistema deve carregar a lista de estados (`estado`) e municípios (`cidade`) dinamicamente a partir da API de Localidades do IBGE.
* **RF-06 (CRUD do Catálogo de Documentos):** O sistema deve permitir gerenciar o catálogo de certidões e documentos exigíveis (`documentos`), com nome do documento, categoria, esfera (Federal, Estadual, Municipal), estado/cidade (quando aplicável) e link da fonte (`fonte_website`).
* **RF-07 (CRUD de Documentos dos Fornecedores):** Na tela de detalhes de um fornecedor, o sistema deve permitir vincular, listar, editar e remover documentos de regularidade (`documentos_fornecedores`), associando um item do catálogo (`documento_id`), data de emissão, data de validade, link do arquivo (`arquivo_url`) e status, destacando visualmente documentos vencidos ou próximos do vencimento.

### Módulo C — Fluxo Licitatório
* **RF-08 (CRUD de Processos Administrativos):** O sistema deve permitir cadastrar, listar, visualizar detalhes, editar e excluir processos administrativos (`processos`) vinculados a uma secretaria requisitante (`secretaria_requisitante_id`), contendo número, ano, assunto, data de abertura, status e link do sistema eletrônico.
* **RF-09 (CRUD de Procedimentos Licitatórios):** O sistema deve permitir cadastrar, listar, visualizar detalhes, editar e excluir procedimentos licitatórios ou contratações diretas (`procedimentos`) vinculados a um processo (`processo_id`), com número, ano, modalidade, objeto, status, data de homologação e link do PNCP.


### Módulo D — Execução Contratual e Fornecimento
* **RF-10 (CRUD de Atas de Registro de Preços):** O sistema deve permitir cadastrar, listar, visualizar, editar e excluir Atas de Registro de Preços (`atas_registro_precos`) vinculadas a um fornecedor (`fornecedor_id`) e a um procedimento (`procedimento_id`), contendo número, ano, objeto, datas de assinatura e validade e status.
* **RF-11 (CRUD de Contratos):** O sistema deve permitir cadastrar, listar, visualizar detalhes, editar e excluir contratos (`contratos`) vinculados a um fornecedor (`fornecedor_id`), um procedimento (`procedimento_id`) e, opcionalmente, a uma ata (`ata_id`), registrando número, ano, objeto, valor global, indicador de prorrogação (`prorrogavel`), datas de assinatura e término e status.
* **RF-12 (Busca e Filtros de Contratos):** A listagem principal de contratos (`TabelaContratos`) deve permitir buscar e filtrar registros por texto (número/objeto/fornecedor), status e período de vencimento.
* **RF-13 (CRUD de Autorizações de Fornecimento):** O sistema deve permitir cadastrar, listar, visualizar, editar e excluir Autorizações de Fornecimento (`autorizacoes_de_fornecimento`) vinculadas a um fornecedor (`fornecedor_id`) e à sua origem contratual ou licitatória (`contrato_id`, `ata_id` ou `procedimento_id`), registrando número, ano, objeto, valor total, data de emissão, prazo de entrega em dias e status.


### Módulo E — Acompanhamento e Fiscalização Contratual (Abas em Detalhes do Contrato)
* **RF-14 (CRUD de Alterações Contratuais):** Na tela de detalhes de um contrato, o sistema deve permitir cadastrar, listar, editar e excluir aditivos e apostilamentos (`alteracoes_contratuais`), registrando tipo, data de assinatura, acréscimo de prazo em dias, valor de acréscimo, valor de supressão e justificativa.
* **RF-15 (CRUD de Gestão e Fiscalização):** Na tela de detalhes de um contrato, o sistema deve permitir designar, listar, editar e remover gestores e fiscais (`gestao`), vinculando um servidor (`servidor_id`) com papel (Gestor/Fiscal), titularidade (`Titular`/`Suplente`), portaria de designação, data de início e data de término.
* **RF-16 (CRUD de Ocorrências de Contrato):** Na tela de detalhes de um contrato, o sistema deve permitir registrar, listar, editar e excluir ocorrências (`ocorrencias_contrato`) apontadas por um servidor (`servidor_id`), contendo data, título, descrição, gravidade, prazo de regularização, status, resposta do fornecedor e link de anexo (`anexo_url`).

---

## 2. Regras de Negócio (RN)

* **RN-01 (Unicidade de Identificadores):** O sistema não deve permitir o cadastro duplicado de:
  * `nome_secretaria` e `sigla_secretaria` em `secretarias`;
  * `registro_funcional` em `servidores`;
  * `cpf_cnpj` em `fornecedores`.
* **RN-02 (Coerência Cronológica de Datas):** O backend deve impedir o salvamento de registros com datas invertidas:
  * Em `documentos_fornecedores`: `validade` deve ser igual ou posterior a `emissao`;
  * Em `atas_registro_precos`: `data_validade` deve ser igual ou posterior a `data_assinatura`;
  * Em `contratos`: `data_de_termino` deve ser igual ou posterior a `data_de_assinatura`;
  * Em `gestao`: quando informada, `data_fim` deve ser igual ou posterior a `data_inicio`;
  * Em `ocorrencias_contrato`: quando informado, `prazo_regularizacao` deve ser igual ou posterior a `data_ocorrencia`.
* **RN-03 (Validação de Valores Monetários e Prazos):**
  * Em `contratos`, `valor_global` deve ser maior que zero;
  * Em `autorizacoes_de_fornecimento`, `valor_total` e `prazo_entrega_dias` devem ser maiores que zero;
  * Em `alteracoes_contratuais`, `acrescimo_prazo_dias`, `valor_acrescimo` e `valor_supressao` não podem ser negativos, e pelo menos um deles deve ser maior que zero (exceto quando o tipo for puramente administrativo/apostilamento sem impacto financeiro ou de prazo).
* **RN-04 (Origem Obrigatória na Autorização de Fornecimento):** Toda `autorizacoes_de_fornecimento` deve possuir obrigatoriamente pelo menos um vínculo de origem preenchido (`contrato_id`, `ata_id` ou `procedimento_id`), além de `fornecedor_id`.
* **RN-05 (Cálculo de Valor e Prazo Atualizados do Contrato):** Na visualização detalhada de um contrato, o sistema deve calcular e exibir dinamicamente:
  * **Valor Atualizado:** `valor_global + SOMA(valor_acrescimo) - SOMA(valor_supressao)` das alterações vinculadas;
  * **Término Atualizado:** `data_de_termino + SOMA(acrescimo_prazo_dias)` das alterações vinculadas.
* **RN-06 (Proteção de Integridade na Exclusão):** Um registro pai não pode ser excluído enquanto houver registros filhos vinculados a ele (ex.: não excluir uma `secretaria` com `servidores` vinculados ou um `fornecedor` com `contratos` cadastrados). O sistema deve bloquear a operação e orientar o usuário de forma clara.
* **RN-07 (Consistência de Esfera no Catálogo de Documentos):** Em `documentos`, os campos `estado` e `cidade` são opcionais para certidões de esfera Federal, mas recomendados/exigíveis conforme a esfera selecionada (Estadual exige `estado`; Municipal exige `estado` e `cidade`).

---

## 3. Requisitos Não Funcionais (RNF)

* **RNF-01 (Arquitetura em Camadas no Backend):** Todos os módulos da API Express devem respeitar rigorosamente a separação:
  * `routes/`: definição de endpoints, extração de parâmetros/body e envio da resposta HTTP;
  * `services/`: validação de campos obrigatórios e aplicação das Regras de Negócio (RN);
  * `repositories/`: execução exclusiva de consultas SQL parametrizadas no PostgreSQL (`$1`, `$2`, prevenindo SQL Injection).
* **RNF-02 (Padronização de Respostas e Códigos HTTP):** A API deve responder em JSON padronizado e utilizar códigos HTTP semânticos:
  * `200 OK` (leitura/atualização), `201 Created` (criação), `204 No Content` ou `200 OK` (exclusão);
  * `400 Bad Request` para falhas de validação de entrada ou regras de negócio;
  * `404 Not Found` quando o ID consultado, editado ou excluído não existir;
  * `409 Conflict` para violações de unicidade (código PostgreSQL `23505`) ou tentativa de exclusão com vínculos ativos (código PostgreSQL `23503`);
  * `500 Internal Server Error` para falhas inesperadas, sem vazar *stack traces* sensíveis ao cliente.
* **RNF-03 (Atualização de Timestamps de Auditoria):** Toda operação de `UPDATE` no banco de dados deve atualizar automaticamente a coluna `atualizado_em = CURRENT_TIMESTAMP`.
* **RNF-04 (Reatividade e Gerenciamento de Estado no Frontend):** As *stores* do Zustand devem centralizar estados de carregamento (`loading`), erros (`error`) e operações assíncronas por domínio, garantindo que criações, edições e exclusões reflitam imediatamente nas tabelas e telas sem exigir recarregamento manual da página.
* **RNF-05 (Feedback Visual e Usabilidade):** Todas as ações de escrita (criar, editar, excluir) devem oferecer confirmação antes de exclusões e exibir feedback claro ao usuário (mensagens de sucesso ou erro vindas da API via componentes Material UI).
* **RNF-06 (Padronização de Datas e Moeda):** As datas devem trafegar no formato ISO (`YYYY-MM-DD`) entre backend e frontend e ser exibidas no padrão brasileiro (`DD/MM/AAAA`) na interface; valores monetários devem ser formatados em Real (`R$ 0.000,00`).
* **RNF-07 (Rastreabilidade no Versionamento):** O desenvolvimento deve seguir entregas incrementais em branches específicas (`feat/...`, `fix/...`), referenciando os códigos de requisitos (`RF-XX`) nas mensagens de commit e Issues do GitHub.