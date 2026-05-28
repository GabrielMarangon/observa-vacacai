# Observa Vacacaí

Sistema web responsivo para participação cidadã e monitoramento socioambiental do Rio Vacacaí, em São Gabriel/RS.

## Arquitetura inicial

O projeto foi organizado como um monorepo simples:

```text
observa_vacacai/
  frontend/   # React + Vite
  backend/    # Node.js + Express
  docs/       # espaco para diagramas e decisoes futuras
```

Na raiz do projeto tambem existe um `package.json` para subir frontend e backend juntos.

### Front-end

- React com Vite
- React Router para as telas principais
- Estrutura pronta para Leaflet
- Home responsiva e base visual institucional

### Back-end

- Node.js com Express
- Estrutura de rotas, controllers e services
- Preparado para PostgreSQL ou Supabase
- Mock inicial para validar o fluxo sem depender do banco no primeiro ciclo

### Banco de dados

O modelo inicial esta em [schema.sql](/c:/meu_chatbot_flask%20-%20Copia/templates/observa_vacacai/backend/database/schema.sql) e contempla:

- usuarios
- denuncias
- sugestoes
- questionarios, perguntas e respostas
- alertas

## Telas iniciais

- Home
- Login
- Cadastro
- Nova denuncia
- Sugestoes
- Questionario
- Alertas
- Mapa
- Painel do gestor

## Como rodar localmente no VS Code

### 1. Subir tudo com um unico comando

```bash
cd observa_vacacai
npm install
npm run dev
```

Esse comando sobe:

- front em `http://localhost:5173`
- back em `http://localhost:3001`

### 2. Subir separadamente, se preferir

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

### 3. Banco de dados

Crie um banco PostgreSQL local chamado `observa_vacacai` e depois execute:

```bash
psql -U postgres -d observa_vacacai -f backend/database/schema.sql
```

Se preferir Supabase, basta apontar `DATABASE_URL` para a connection string do projeto.

## URLs de teste

- Front-end: `http://localhost:5173`
- Back-end health: `http://localhost:3001/api/health`
- Conteudo inicial: `http://localhost:3001/api/content/home`
- Listagem de denuncias: `http://localhost:3001/api/reports`
- Mapa interativo: `http://localhost:5173/mapa`
- Painel do gestor: `http://localhost:5173/gestor`

## Proximos passos sugeridos

1. Adicionar autenticacao com JWT.
2. Implementar upload real de imagens.
3. Persistir denuncias em PostgreSQL/Supabase.
4. Evoluir filtros do painel do gestor.
5. Adicionar camadas geoespaciais de APP, risco e clima.
