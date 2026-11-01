# Gerenciador de Contratos

Aplicação web para apoiar o cadastro, o controle e o acompanhamento de contratos administrativos, fornecedores, documentos e servidores públicos. O projeto é voltado especialmente para processos submetidos à **Lei Federal nº 14.133/2021 (Nova Lei de Licitações)**.

## Demonstração

A aplicação está disponível online:

**[Acessar o sistema](https://gestaodecontratos--joaoguilherm142.replit.app/contratos)**

## Funcionalidades

- Cadastro, consulta, edição e exclusão de contratos;
- Cadastro e edição de fornecedores;
- Consulta de contratos relacionados a fornecedores;
- Cadastro, consulta e edição de servidores;
- Associação de servidores a secretarias;
- Cadastro e consulta de documentos;
- Cadastro de documentos vinculados a fornecedores;
- Filtros para consulta de fornecedores e servidores;
- Consulta de estados e municípios por meio da API do IBGE.

O projeto está em desenvolvimento e novas funcionalidades serão adicionadas progressivamente.

## Tecnologias

### Frontend

- React;
- Vite;
- React Router;
- Zustand;
- JavaScript;
- Oxlint.

### Backend

- Node.js;
- Express;
- PostgreSQL;
- `pg`;
- CORS.

## Estrutura do projeto

```text
src/
├── components/     Componentes reutilizáveis da interface
├── pages/          Páginas e rotas da aplicação
├── store/          Stores Zustand e comunicação com a API
└── index.css       Estilos globais

backend/
├── routes/         Rotas da API
├── database.js     Conexão e criação das tabelas
├── seed.js         Dados iniciais para desenvolvimento
└── server.js       Servidor Express
```

## Pré-requisitos

- Node.js;
- npm;
- Uma instância PostgreSQL;
- Variável de ambiente `DATABASE_URL` configurada com a URL de conexão do PostgreSQL.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/JoaoGuilhermeTP/gestao_de_contratos.git
cd gestao_de_contratos
```

Instale as dependências:

```bash
npm install
```

Configure a variável de ambiente `DATABASE_URL` em um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
```

As tabelas são verificadas e criadas automaticamente quando o backend é iniciado.

## Desenvolvimento

Para iniciar frontend e backend simultaneamente:

```bash
npm run dev
```

Para iniciar cada serviço separadamente:

```bash
# Frontend
npm run dev:frontend

# Backend
npm run dev:backend
```

O frontend é executado na porta `5000` e a API na porta `3000`.

## Dados iniciais

Para inserir os dados de exemplo no banco:

```bash
npm run seed
```

Use esse comando somente em um banco de desenvolvimento ou em um banco preparado para receber os dados iniciais.

## Comandos disponíveis

```bash
# Gerar a versão de produção do frontend
npm run build

# Executar o lint
npm run lint

# Visualizar o frontend de produção
npm run preview

# Visualizar o frontend de produção e iniciar o backend
npm run preview:full

# Servir o diretório dist
npm run start
```

## API

O backend disponibiliza os seguintes recursos:

| Recurso | Endpoint base |
| --- | --- |
| Contratos | `/api/contratos` |
| Fornecedores | `/api/fornecedores` |
| Documentos | `/api/documentos` |
| Servidores | `/api/servidores` |
| Secretarias | `/api/secretarias` |
| Processos | `/api/processos` |
| Status da API | `/api/status` |

As rotas de contratos, fornecedores e servidores incluem operações de criação, atualização e exclusão conforme suportado pelo recurso.

## Status

🚧 **Projeto em desenvolvimento.**

## Autor

**João Guilherme**

GitHub: [JoaoGuilhermeTP](https://github.com/JoaoGuilhermeTP)
