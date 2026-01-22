# ELLA Frontend

Frontend do ELLA (assistente financeira) feito com **Vite + React + TypeScript**, usando **React Router** e **TailwindCSS**.

## Licença / Propriedade

Projeto **particular e proprietário**. Reprodução/redistribuição não é permitida sem autorização.

- Licença: [LICENSE.md](../LICENSE.md)
- Aviso: [NOTICE.md](NOTICE.md)

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm (ou pnpm/yarn)

## Rodando em desenvolvimento

1. Instale as dependências:

npm install

2. Crie um arquivo `frontend/.env.local` (veja o exemplo em `frontend/.env.example`).

3. Suba o app:

npm run dev

Por padrão o Vite sobe em `http://localhost:5173`.

## Configuração (variáveis de ambiente)

O Vite só expõe variáveis com prefixo `VITE_`.

Variáveis usadas no projeto:

- `VITE_API_URL` (recomendada)
  - URL do backend **sem** `/api`.
  - Ex.: `http://localhost:8080` (DEV) ou `https://seu-backend.onrender.com` (produção)
- `VITE_API_BASE_URL` (legado / compatibilidade)
  - Base URL do backend **incluindo** `/api`.
  - Ex.: `http://localhost:8080/api`
- `VITE_PUBLIC_TESTING_NOTICE` (opcional)
  - Quando `true`, mostra a mensagem "Você está participando da etapa de testes." no rodapé também fora do modo DEV.
  - Em DEV a mensagem já aparece automaticamente.

Observação importante: o cliente HTTP (Axios/fetch) resolve a base da API por estas regras:

- Se `VITE_API_URL` estiver definida: usa `${VITE_API_URL}/api`
- Senão, se `VITE_API_BASE_URL` estiver definida: usa ela diretamente
- Em DEV, fallback: `http://localhost:8080/api`
- Em produção, fallback: `/api` (requer reverse-proxy/rewrites no provedor)

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção (TypeScript + Vite)
- `npm run preview` — preview do build
- `npm run test` — modo watch do Vitest
- `npm run test:run` — executa testes uma vez (ideal pra CI)
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Estrutura de pastas (alto nível)

- `src/pages/` — páginas (Login, Register, Forgot/Reset Password, Dashboard, etc.)
- `src/routes/` — definição de rotas públicas e do dashboard
- `src/lib/http.ts` — Axios com interceptors (JWT + refresh)
- `src/lib/api.ts` — wrapper alternativo via `fetch`
- `src/contexts/` — AuthContext
- `src/components/` — componentes reutilizáveis (inclui `components/shared/Footer.tsx`)
- `src/services/` — serviços por domínio (score, etc.)

## Autenticação (resumo)

- O token JWT é guardado em `localStorage` (chave `ella:token`).
- O client HTTP adiciona `Authorization: Bearer <token>` automaticamente em rotas protegidas.
- Em `401`, o frontend tenta renovar via `POST /auth/refresh` (com `withCredentials: true`).
  - Isso pressupõe que o backend esteja com CORS permitindo credenciais e que o refresh funcione por cookie/credencial.

## Build e deploy

Build:

npm run build

Preview local do build:

npm run preview

Em produção, garanta que `VITE_API_URL` (recomendado) ou `VITE_API_BASE_URL` esteja definida no ambiente de build do seu provedor (Vercel/Netlify/Docker/VM/etc.).

## Troubleshooting

- Erros de request / API: confirme `VITE_API_URL`/`VITE_API_BASE_URL` e se apontam para o backend publicado.
- CORS / refresh token falhando: verifique CORS no backend e se ele aceita `credentials`.
- Aviso de "etapa de testes": em DEV aparece sempre; em produção use `VITE_PUBLIC_TESTING_NOTICE=true`.
