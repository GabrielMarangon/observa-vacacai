# Deploy no Render - Observa Vacacai

## Estrategia recomendada

Publicar o projeto em dois servicos:

- `observa-vacacai-api`: backend Node.js/Express
- `observa-vacacai-web`: frontend React/Vite como site estatico

O arquivo `render.yaml` na raiz do projeto ja deixa essa estrutura preparada para Blueprint.

## Preparo ja aplicado no projeto

- Backend com `healthCheckPath: /health`
- Frontend estatico com `rewrite` para SPA
- Node fixado em `18.16.0` para evitar usar o padrao atual do Render
- Auto deploy por commit habilitado nos dois servicos

## Publicar primeiro no GitHub

Este projeto precisa estar em um repositorio GitHub para o Render acompanhar os deploys.

Se esta pasta ainda nao estiver versionada com Git, use:

```bash
git init -b main
git add .
git commit -m "Preparar deploy do Observa Vacacai no Render"
```

Depois, crie um repositorio vazio no GitHub e conecte:

```bash
git remote add origin https://github.com/SEU_USUARIO/observa-vacacai.git
git push -u origin main
```

## Variaveis de ambiente

### Backend

- `DATABASE_URL`
- `CORS_ORIGIN`

Exemplo:

```text
CORS_ORIGIN=https://observa-vacacai-web.onrender.com
```

### Frontend

- `VITE_API_BASE_URL`

Exemplo:

```text
VITE_API_BASE_URL=https://observa-vacacai-api.onrender.com
```

## Publicacao

1. Subir o repositorio para o GitHub.
2. No Render, escolher `New +` > `Blueprint`.
3. Conectar sua conta do GitHub ao Render, se ainda nao estiver conectada.
4. Selecionar o repositorio do Observa Vacacai.
5. Confirmar o uso do `render.yaml`.
6. Criar os dois servicos sugeridos pelo Blueprint.
7. Preencher as variaveis de ambiente.
8. Executar o deploy.
9. Depois do primeiro deploy, confirmar no painel do Render quais foram as URLs finais geradas para cada servico e, se necessario, ajustar:

```text
CORS_ORIGIN=https://URL_REAL_DO_FRONTEND.onrender.com
VITE_API_BASE_URL=https://URL_REAL_DA_API.onrender.com
```

10. Fazer um novo deploy apos salvar essas variaveis, se as URLs reais diferirem dos exemplos acima.

## Observacoes

- O backend atualmente aceita as origens definidas em `CORS_ORIGIN`.
- O frontend ja usa `VITE_API_BASE_URL`, entao nao depende de URL fixa de localhost em producao.
- A persistencia definitiva ainda depende da configuracao do banco de dados remoto.
- Como hoje o projeto usa armazenamento em memoria para denuncias, o app pode subir mesmo antes da configuracao final do banco.
