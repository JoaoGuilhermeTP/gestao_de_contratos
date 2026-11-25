# Documento de Escopo — Gestão de Contratos (v1.0)

## 1. Visão Geral e Problema
Na administração pública, o controle de processos administrativos, licitações, atas de registro de preços, contratos, aditivos, regularidade de fornecedores e fiscalização costuma ficar disperso em planilhas isoladas e controles manuais. Isso dificulta o acompanhamento de prazos de vigência, a rastreabilidade da origem de cada contratação e o registro histórico de ocorrências.

O **Gestão de Contratos** é uma aplicação web full-stack desenvolvida para centralizar o ciclo de vida das contratações públicas sob a ótica da **Lei nº 14.133/2021**, conectando desde a abertura do processo administrativo até a fiscalização da execução contratual.

---

## 2. Público-Alvo e Objetivo do Projeto
* **Usuários simulados:** Servidores administrativos, agentes de contratação, gestores e fiscais de contratos municipais.
* **Objetivo de portfólio:** Demonstrar domínio prático de engenharia de software full-stack, incluindo:
  * Modelagem de banco de dados relacional com 13 entidades interdependentes;
  * Construção de API RESTful com separação estrita de responsabilidades;
  * Gerenciamento previsível de estado e consumo de APIs no frontend;
  * Documentação técnica e entregas incrementais orientadas a requisitos.

---

## 3. Escopo da Versão 1.0 (Definição de Pronto / MVP)
A Versão 1.0 será considerada concluída quando atender a todos os critérios abaixo:

1. **Cobertura completa da API:** Todas as 13 tabelas do banco PostgreSQL expostas por endpoints RESTful padronizados (criação, listagem, detalhamento, atualização e exclusão).
2. **Integração total com o Frontend (CRUD):** Todas as 13 entidades manipuláveis pela interface React, organizadas entre páginas independentes (entidades principais) e abas/seções internas (entidades dependentes vinculadas a um registro pai).
3. **Integridade e validação:** Validação de regras de negócio no backend (datas coerentes, valores válidos, campos obrigatórios), tratamento padronizado de erros HTTP e proteção contra exclusão de registros com vínculos ativos (chaves estrangeiras).
4. **Integração externa funcional:** Preenchimento de estados e municípios via **API de Localidades do IBGE** nos formulários aplicáveis.

---

## 4. Módulos Funcionais (Mapa das 13 Entidades)
O sistema está dividido em cinco módulos lógicos que respeitam a ordem de dependência do banco de dados:

* **Estrutura Organizacional:** `secretarias`, `servidores`
* **Fornecedores e Regularidade:** `fornecedores`, `documentos`, `documentos_fornecedores`
* **Fluxo Licitatório:** `processos`, `procedimentos`
* **Execução Contratual:** `contratos`, `atas_registro_precos`, `autorizacoes_de_fornecimento`
* **Acompanhamento e Fiscalização:** `alteracoes_contratuais`, `gestao`, `ocorrencias_contrato`

---

## 5. Premissas e Restrições Técnicas
* **Frontend:** React (Vite), React Router, Zustand e Material UI.
* **Backend:** Node.js e Express estruturados em arquitetura em camadas (`routes` → `services` → `repositories`).
* **Banco de Dados:** PostgreSQL Serverless (Neon).
* **Integrações Externas:** API de Localidades do IBGE.
* **Versionamento e Hospedagem:** Git/GitHub e Replit.

---

## 6. Fora de Escopo na Versão 1.0 (Backlog para v1.1+)
Para manter o foco na conclusão integral do CRUD e evitar aumento descontrolado de escopo (*scope creep*), os itens abaixo ficam explicitamente adiados para versões futuras:

* **Autenticação e Autorização:** Login de usuários (JWT/sessão) e Controle de Acesso Baseado em Papéis (RBAC).
* **Armazenamento de Arquivos Binários:** Upload físico de PDFs/imagens para serviços de storage (S3/Cloud Storage). Na v1.0, certidões e anexos serão registrados via campos de URL (`arquivo_url` e `anexo_url`).
* **Integração ativa com PNCP/Sistemas Externos:** Consulta ou envio automatizado ao Portal Nacional de Contratações Públicas. Na v1.0, o sistema armazena apenas os links de referência (`link_pncp` e `link_sistema_eletronico`).
* **Relatórios e Alertas Automáticos:** Dashboards analíticos com gráficos, exportação de planilhas/PDFs e notificações automáticas de vencimento por e-mail.