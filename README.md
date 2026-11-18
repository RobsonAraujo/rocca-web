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
cp .env.example .env.local   # sem as chaves do Supabase, usa o mock em memória
pnpm db:start                # opcional: Supabase local em Docker (veja "Banco local")
pnpm dev                     # http://localhost:3000
```

## Scripts

| Script                  | O que faz                                        |
| ----------------------- | ------------------------------------------------ |
| `pnpm dev`              | Servidor de desenvolvimento                      |
| `pnpm build`            | Build de produção                                |
| `pnpm start`            | Sobe o build de produção                         |
| `pnpm lint`             | ESLint (`lint:fix` corrige)                      |
| `pnpm format`           | Prettier em tudo (`format:check` só verifica)    |
| `pnpm typecheck`        | Gera os tipos de rota do Next e roda `tsc`       |
| `pnpm test`             | Vitest em modo watch                             |
| `pnpm test:run`         | Vitest uma vez (CI)                              |
| `pnpm test:coverage`    | Testes com relatório de cobertura em `coverage/` |
| `pnpm test:integration` | Testes de integração contra o Supabase **local** |
| `pnpm db:start`         | Sobe o Supabase local (Docker)                   |
| `pnpm db:stop`          | Para o Supabase local                            |
| `pnpm db:migrate`       | Aplica as migrations pendentes no banco local    |
| `pnpm db:reset`         | Recria o banco local: migrations + `seed.sql`    |
| `pnpm db:status`        | URLs e chaves do Supabase local                  |
| `pnpm db:migrate:prod`  | Aplica as migrations em **prod** (só por você)   |

No pre-commit, o Husky roda o `lint-staged`, que aplica `eslint --fix` e `prettier --write` nos arquivos staged.

## Arquitetura

O código é organizado por feature. Cada feature guarda os próprios componentes, a regra de negócio e os testes.

```
src/
├─ app/                    # rotas: /, /preview, /preview/portfolio, robots, sitemap
├─ components/
│  ├─ ui/                  # gerado pelo shadcn (não editar à mão sem motivo)
│  ├─ layout/              # logo e ano do copyright (compartilhados)
│  └─ product/             # peças de produto usadas na landing e no preview: cores de identidade, anel de progresso, linhas de ordem
├─ config/site.ts          # nome da marca, descrição, URL
├─ lib/                    # env (validada com zod), utils
└─ features/
   ├─ landing/
   │  ├─ content.ts        # TODA a copy da landing
   │  ├─ landing.tsx       # monta a página: header, sections/, footer
   │  ├─ primitives.tsx    # Container e Section (alinhamento e espaçamento)
   │  └─ sections/         # hero, features (bento), how it works, FAQ, CTA
   ├─ preview/            # dashboard de demonstração (dados simulados)
   │  ├─ shell.tsx       # sidebar, barra superior e aviso legal (usado pelo layout)
   │  ├─ overview.tsx    # página inicial do preview
   │  ├─ data.ts         # copy e dados simulados da página inicial
   │  ├─ demo-state.tsx  # estado simulado compartilhado: decisão da NVDA e modo de autonomia
   │  ├─ components/     # painel, gráfico SVG, navegação, chat, "em breve", banner, tour
   │  ├─ widgets/        # um arquivo por módulo da página inicial
   │  └─ portfolio/      # página de portfolio: dados, gráficos, insights, posições
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
5. No sucesso, o formulário abre o preview do dashboard (`/preview?welcome=new`, ou `welcome=back` se o email já estava na lista).

A UI não conhece o banco, e o service não conhece o Next.js.

### Preview do dashboard

Quem entra na lista é levado na hora para `/preview`, uma versão navegável do dashboard, sem login, para ver como o produto vai ser. A ideia é que esse preview seja a recompensa da inscrição.

- A rota não tem link na landing e tem `noindex`. Ela abre para qualquer pessoa com a URL, mas não é divulgada.
- São duas páginas: a visão geral (`/preview`) e o portfolio (`/preview/portfolio`). O `app/preview/layout.tsx` mantém a sidebar e a barra superior entre elas. Os outros itens do menu mostram "em breve".
- Todos os dados são simulados. A visão geral usa `features/preview/data.ts`, e o portfolio usa `features/preview/portfolio/data.ts`. O total da carteira, as contas e a ordem de NVDA/VTI vêm do `content.ts` da landing, para as páginas nunca mostrarem números diferentes.
- No portfolio, as posições são guardadas por conta, e pesos, alocação e totais são calculados a partir delas. Um teste garante que cada conta soma o mesmo valor da landing.
- No celular (abaixo de 768px) o preview vira um app nativo: barra superior compacta, barra de abas embaixo (Home, Portfolio, Ask, Learn, More), detalhes em bottom sheets (Base UI Drawer) e seletor segmentado no Portfolio. O código fica em `features/preview/mobile/`. Desktop e tablet não mudam.
- As ações principais são simuladas, para o visitante sentir o produto. Cada simulação termina com a nota da waitlist (`demo.waitlistNote` em `data.ts`):
  - **Aprovar a sugestão de NVDA:** passa por "placing orders" (1,2 s) e mostra um recibo simulado. A regra dos 12% volta a ficar ok. "Not now" pula a sugestão, e "Reset demo" volta ao começo.
  - **Modo de autonomia:** os pontos do dial trocam o modo. O pill do cabeçalho, o bloco "In this mode", a nota da decisão e a linha "Mode" do mobile acompanham.
  - **Ask Rocca:** as três sugestões têm respostas prontas (`ask.answers`), e qualquer outra pergunta recebe `ask.fallback`. A resposta aparece depois de um "typing" curto, que não acontece com `prefers-reduced-motion`.
  - **Gráfico:** os ranges 1W/1M/1Y/All funcionam com séries simuladas (`portfolio.chart.series`). Todas terminam no total da landing, e um teste garante isso.
- O estado da simulação fica no `DemoStateProvider` (`demo-state.tsx`), montado pelo `PreviewShell`. Ele se mantém entre Overview e Portfolio, e recarregar a página zera a demo.
- O chat é um compositor no estilo ChatGPT: o campo cresce com o texto, Enter envia e Shift+Enter quebra a linha. As sugestões preenchem o campo.
- O que precisaria do produto real (navegar para páginas que não existem, conectar conta, lições, histórico, adicionar regra, anexar, voz) continua mostrando o toast de "em breve". Use `ComingSoonButton` ou `notifyComingSoon()` em `features/preview/components/coming-soon.tsx`.
- Tour guiado (`components/guided-tour.tsx`): 3 passos (decisão, autonomia, chat) na primeira visita com `?welcome=new`. O anel de destaque não bloqueia cliques, então dá para aprovar no meio do tour. Pular ou terminar fica salvo no `localStorage` (`rocca-tour-done`). Cada passo aponta para um id do desktop e um do mobile, e o tour usa o que estiver visível.
- O banner de boas-vindas lê o `?welcome=` no client, dentro de um `<Suspense>`, então a página continua estática.
- Os módulos mostram os diferenciais contra Astor e Volaren: o raciocínio com a fonte de cada passo, a escolha da conta que paga menos imposto, a trilha de aprendizado para iniciantes, o nível de autonomia com regras próprias, o placar com os erros à mostra e o dinheiro que dá para economizar.

### Cores e tema

A landing tem só um tema, claro. Os tokens ficam em `:root` (`globals.css`): fundo papel quente, texto e botões em tinta, e o verde esmeralda (`--brand`) usado com moderação como destaque. As sombras `shadow-soft` e `shadow-float` também são definidas lá.

A landing e o preview do dashboard usam mais três cores de destaque, também como tokens, para cada ideia ter uma identidade visual. Todas passam o contraste 4,5:1 sobre branco e sobre o próprio fundo tingido. Use as classes `bg-*`, `text-*` e `ring-*` delas, ou o mapa `toneClasses` em `components/product/tone.tsx`:

- `attention` (âmbar): algo precisa da sua ação, como a sugestão pendente e a regra estourada.
- `control` (violeta): autonomia e regras, ou seja, quanto a Rocca faz por você.
- `learn` (azul): lições e explicações em inglês simples.

O `@custom-variant dark` continua no `globals.css` de propósito. Ele mantém inativas as classes `dark:` dos componentes do shadcn. Sem ele, o Tailwind seguiria o modo escuro do sistema operacional e aplicaria estilos escuros na página clara.

### Mock e Supabase

`getWaitlistRepository()` escolhe o backend pelas variáveis de ambiente:

- **Sem `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY`:** usa o `InMemoryWaitlistRepository`. Os dados vivem na memória do processo e somem ao reiniciar. Um aviso aparece no log do servidor.
- **Com as duas:** usa o `SupabaseWaitlistRepository`.
- **Com só uma delas**, ou com uma publishable key no lugar da secret: o servidor recusa a configuração com um erro claro ([`src/lib/env.ts`](src/lib/env.ts)), em vez de cair no mock calado.

Local e Vercel usam **os mesmos nomes de variável**; só os valores mudam. Em desenvolvimento, o `.env.local` aponta para o **Supabase local** (veja abaixo). As credenciais de produção ficam só na Vercel, nunca em arquivo local.

A tabela tem RLS ligado e nenhuma policy pública, e a migration `0002` ainda revoga os privilégios de `anon` e `authenticated`. Só o servidor, com a secret key (`sb_secret_…`, a antiga service role key), consegue ler e escrever. Emails duplicados são barrados por um índice único em `lower(email)`.

A publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) não grava nada: a tabela a barra de propósito, e os testes de integração conferem isso. Ela fica configurada para quando surgir uma feature client-side, como o Supabase Auth. A `SUPABASE_SECRET_KEY` **nunca** leva o prefixo `NEXT_PUBLIC_`, porque esse prefixo manda o valor para o bundle do browser.

### Banco local

Regra: **tudo roda e é testado localmente primeiro.** O único caminho até produção é o `pnpm db:migrate:prod`, rodado por uma pessoa (veja abaixo). O [`.claude/settings.json`](.claude/settings.json) proíbe agentes de rodar `supabase link`, `db push`, `--linked`, `--db-url` e esse script.

Pré-requisitos: Docker rodando e o [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
pnpm db:start           # 1ª vez baixa as imagens; aplica migrations e seed
pnpm db:status          # copie a URL e as chaves para o .env.local
pnpm test:integration   # tabela real, índice único, RLS barrando a chave pública
pnpm dev
```

- As portas ficam na faixa **5442x** (API `54421`, banco `54422`, Studio `54423`), para rodar ao lado de outros projetos Supabase locais, que usam 5432x.
- `.env.local` usa `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421`, a `SECRET_KEY` local em `SUPABASE_SECRET_KEY` e a `PUBLISHABLE_KEY` local em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. São as chaves demo fixas do CLI, sem valor fora da sua máquina.
- Os testes de integração **recusam rodar** se `NEXT_PUBLIC_SUPABASE_URL` não for `127.0.0.1`/`localhost`, e apagam as linhas que criaram.
- `supabase/seed.sql` fica vazio de propósito: nada de dados reais de inscritos.

Aplicar migrations no banco local:

- `pnpm db:migrate`: aplica **só as pendentes** e mantém os dados. Use depois de um `git pull` que trouxe migration nova.
- `pnpm db:reset`: **apaga** o banco local e reaplica todas as migrations + `seed.sql`. Use para validar o schema do zero (o deploy de prod sempre roda este antes).

Nova mudança de schema:

1. `supabase migration new <nome>` e escreva o SQL.
2. `pnpm db:migrate` para aplicar e testar no app (`pnpm dev`).
3. `pnpm db:reset`, depois `pnpm test:integration` e `pnpm test:run`, para garantir que tudo sobe do zero.
4. Commit da migration. O deploy em prod é o passo seguinte, abaixo.

### Deploy do schema em produção

**Feito por uma pessoa, depois de validar localmente.** Pré-requisito: `supabase login` com a conta dona do projeto de prod.

```bash
pnpm db:migrate:prod
```

O script ([`scripts/migrate-prod.sh`](scripts/migrate-prod.sh)) faz, em ordem:

1. Exige um terminal interativo. Em CI, script ou agente, ele para na hora.
2. Lê `SUPABASE_PROD_PROJECT_REF` do `.env.local`. O ref não é segredo, e o app nunca lê essa variável.
3. Roda `pnpm db:reset` e `pnpm test:integration` localmente. Se algo falhar, para antes de tocar em prod.
4. Busca a senha do banco de prod, nesta ordem: `SUPABASE_DB_PASSWORD` no shell, o Keychain do macOS (veja abaixo) ou o prompt. A senha nunca vai para arquivo nem para a linha de comando.
5. Faz o `supabase link` e mostra o `db push --dry-run`. Se não houver nada pendente, encerra.
6. Pede que você digite `yes`, e só então roda o `supabase db push`.
7. Ao sair, por qualquer motivo (sucesso, erro ou Ctrl+C), roda `supabase unlink`. Assim nenhum comando `supabase` posterior cai em prod por engano.

### Senha de prod no Keychain (opcional)

Para não digitar a senha toda vez, salve-a **uma vez** no Keychain do macOS. A conta do item é o project ref:

```bash
# Salvar. O -w no fim faz o comando pedir a senha, que assim não fica no histórico do shell.
security add-generic-password -s rocca-supabase-prod -a aygzutbnbsevguzqqjth -T "" -w

# Trocar (depois de resetar a senha no dashboard): o mesmo comando com -U.
security add-generic-password -U -s rocca-supabase-prod -a aygzutbnbsevguzqqjth -T "" -w

# Remover.
security delete-generic-password -s rocca-supabase-prod -a aygzutbnbsevguzqqjth
```

> [!WARNING]
> Por causa do `-T ""`, o macOS mostra um diálogo pedindo permissão **toda vez** que algo tenta ler a senha. Clique em **"Permitir"**, nunca em **"Sempre permitir"**. Com "Sempre permitir", qualquer processo (um agente de IA incluso) passa a ler a senha de prod sem aviso. Se você negar, ou se o item não existir, o script volta a pedir a senha no terminal.

- Se o projeto de prod mudar, o ref muda e o item antigo deixa de ser usado. Salve um novo e apague o antigo.
- **Não use um `.env` para a senha.** Ela é de superusuário (`postgres`), e em texto puro fica legível por qualquer ferramenta com acesso ao repo, que poderia conectar direto via `psql`. Além disso, o Next carrega sozinho o `.env.local` e o `.env.production.local`: com dados de prod num deles, `pnpm dev` ou `pnpm start` na sua máquina passariam a falar com produção.

### Produção (Vercel)

O app em produção lê as credenciais só das Environment Variables da Vercel. Projeto de prod: `aygzutbnbsevguzqqjth`.

| Variável                               | Production                                 | Preview            |
| -------------------------------------- | ------------------------------------------ | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | `https://aygzutbnbsevguzqqjth.supabase.co` | vazio (usa o mock) |
| `SUPABASE_SECRET_KEY`                  | secret key `sb_secret_…` do projeto        | vazio (usa o mock) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key `sb_publishable_…`         | vazio              |
| `NEXT_PUBLIC_SITE_URL`                 | domínio de produção                        | URL do preview     |

- As duas chaves ficam em Supabase → Project Settings → API Keys. Sem a **secret**, o app não grava: a publishable é barrada pela tabela.
- Preview sem `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY` usa o mock em memória, para que deploys de PR não gravem inscrições de teste em prod.
- Variáveis `NEXT_PUBLIC_*` são embutidas no build. Depois de mudar qualquer variável na Vercel, faça um redeploy.
- Primeiro deploy de um projeto novo: **schema antes, app depois**. Rode o `pnpm db:migrate:prod`, depois configure as variáveis e faça o redeploy. Na ordem inversa, o app tenta gravar numa tabela que ainda não existe.

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
