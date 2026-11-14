# Rocca

Landing page com lista de espera da Rocca, um agente de investimentos com IA para o mercado americano. O site é em inglês.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components) e **React 19**
- **TypeScript** em modo strict, com `noUncheckedIndexedAccess`
- **Tailwind CSS 4** e **shadcn/ui** (base `base-nova`, com Base UI), mais **lucide-react**
- **Zod 4** para validação
- **Supabase** para persistência. Por enquanto fica **mockado em memória**.
- **Vitest 5** e **Testing Library** para testes unitários
- **ESLint**, **Prettier** (com o plugin do Tailwind), **Husky** e **lint-staged**

## Como rodar

```bash
pnpm install
cp .env.example .env.local   # opcional: sem Supabase, usa o mock em memória
pnpm dev                     # http://localhost:3000
```

## Scripts

| Script               | O que faz                                        |
| -------------------- | ------------------------------------------------ |
| `pnpm dev`           | Servidor de desenvolvimento                      |
| `pnpm build`         | Build de produção                                |
| `pnpm start`         | Sobe o build de produção                         |
| `pnpm lint`          | ESLint (`lint:fix` corrige)                      |
| `pnpm format`        | Prettier em tudo (`format:check` só verifica)    |
| `pnpm typecheck`     | Gera os tipos de rota do Next e roda `tsc`       |
| `pnpm test`          | Vitest em modo watch                             |
| `pnpm test:run`      | Vitest uma vez (CI)                              |
| `pnpm test:coverage` | Testes com relatório de cobertura em `coverage/` |

No pre-commit, o Husky roda o `lint-staged`, que aplica `eslint --fix` e `prettier --write` nos arquivos staged.

## Arquitetura

O código é organizado por feature. Cada feature guarda os próprios componentes, a regra de negócio e os testes.

```
src/
├─ app/                    # rotas: / (light), /dark, robots, sitemap
├─ components/
│  ├─ ui/                  # gerado pelo shadcn (não editar à mão sem motivo)
│  └─ layout/              # logo e ano do copyright (compartilhados)
├─ config/site.ts          # nome da marca, descrição, URL
├─ lib/                    # env (validada com zod), utils
└─ features/
   ├─ landing/
   │  ├─ content.ts        # TODA a copy, compartilhada pelas duas versões
   │  ├─ components/       # layout-switcher (temporário)
   │  ├─ light/            # versão "Light": header, footer, sections/
   │  └─ dark/             # versão "Dark": header, footer, sections/
   └─ waitlist/
      ├─ schema.ts         # validação (zod), compartilhada entre client e server
      ├─ service.ts        # regra de negócio, recebe o repositório por parâmetro
      ├─ actions.ts        # server action: honeypot, validação, service
      ├─ components/       # WaitlistForm (useActionState)
      └─ repository/       # interface + implementações in-memory e Supabase
```

Fluxo de um cadastro na lista:

1. O `WaitlistForm` envia o formulário para a server action `joinWaitlist`.
2. A action ignora bots pelo honeypot e valida o email com `waitlistSchema`.
3. A action chama `addToWaitlist(entry, getWaitlistRepository())`.
4. O repositório grava o email.

A UI não conhece o banco, e o service não conhece o Next.js.

### Duas versões de layout (temporário)

Existem duas versões da landing para escolher uma:

| Rota    | Versão    | Estilo                                                                    |
| ------- | --------- | ------------------------------------------------------------------------- |
| `/`     | **Light** | Clara: hero dividido, features em bento, passos em linha do tempo         |
| `/dark` | **Dark**  | Escura e centralizada: preview em formato de dashboard, features em cards |

As duas usam a mesma copy (`content.ts`) e o mesmo formulário, então a comparação é só de layout. Um botão flutuante, o `LayoutSwitcher`, troca entre elas. A rota `/dark` tem `noindex`.

**Como funcionam as cores:** os tokens da versão Light ficam em `:root` (`globals.css`). A versão Dark envolve a página em `<div class="dark" data-page-theme="dark">`, o que aplica os tokens escuros só nela.
Depois que vocês escolherem uma versão:

1. Apague a pasta da versão descartada (`features/landing/light` ou `features/landing/dark`) e a rota dela.
2. Se a escolhida for a Dark, mova a página para `app/page.tsx`.
3. Apague o `features/landing/components/layout-switcher.tsx` e o teste dele.
4. Remova o `pb-16` do wrapper da landing, que existe só para o botão flutuante não cobrir o footer.

### Mock e Supabase

`getWaitlistRepository()` escolhe o backend pelas variáveis de ambiente:

- **Sem `SUPABASE_*`:** usa o `InMemoryWaitlistRepository`. Os dados vivem na memória do processo e somem ao reiniciar. Um aviso aparece no log do servidor.
- **Com `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`:** usa o `SupabaseWaitlistRepository`.

Para ligar o Supabase:

1. Crie o projeto no Supabase.
2. Rode [`supabase/migrations/0001_create_waitlist.sql`](supabase/migrations/0001_create_waitlist.sql) no SQL Editor, ou use `supabase db push`.
3. Preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` e na Vercel.
4. Reinicie o `pnpm dev`.

A tabela tem RLS ligado e nenhuma policy pública: só o servidor, com a service role, consegue escrever. Emails duplicados são barrados por um índice único em `lower(email)`.

### Cache Components

O `cacheComponents` está ligado no `next.config.ts`, então a página é pré-renderizada de forma estática. Algumas regras:

- Valores não determinísticos lidos durante o render, como `new Date()` e `Math.random()`, precisam de `"use cache"` ou de `connection()` com `<Suspense>`. O ano do footer é um exemplo.
- Evite ler `searchParams` no servidor para não deixar a página dinâmica. O `utm_source` é lido no client pelo `WaitlistForm`.

Antes de usar uma API nova do Next, consulte a documentação local em `node_modules/next/dist/docs/` (veja o `AGENTS.md`).

## Testes

Os testes ficam ao lado do código (`*.test.ts(x)`). Unit tests não cobrem Server Components `async`: a lógica deles fica em funções puras, que são testadas diretamente.

O pacote `server-only` é trocado por um stub no Vitest (veja o `vitest.config.mts`).

## Pendências conhecidas

- O texto legal do footer ("not a registered investment adviser" e o disclaimer) é **placeholder**. Revise com um advogado antes do lançamento.
- O preview do produto é simulado e está marcado como "Simulated".
- Próximos passos:
  - Supabase real
  - Rate limit (Upstash) e Cloudflare Turnstile
  - Email de confirmação (Resend)
  - Indicação e posição na fila
  - Analytics
  - Playwright E2E e CI
  - OG image
