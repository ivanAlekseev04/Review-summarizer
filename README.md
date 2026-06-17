# Review summarizer

A product reviews app: a React client lists products, and for a selected product shows its reviews plus an
AI-generated summary of those reviews, cached in Postgres for 7 days.

Bun workspace monorepo with `packages/client` and `packages/server`.

## ClaudeCode course notes
- See the `ClaudeCode` important commands/concepts [here](notes/ClaudeCode%20notes.md)

## Tech Stack

### Backend (`packages/server`)

- **Runtime / language**: [Bun](https://bun.com), TypeScript
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) (`@prisma/client`), using the `@prisma/adapter-pg` driver adapter and the `pg` driver
- **Validation**: [Zod](https://zod.dev/) (request params/body parsing in controllers)
- **AI**: [OpenAI SDK](https://github.com/openai/openai-node) (`openai`) — generates review summaries
- **Utilities**: [dayjs](https://day.js.org/) (summary cache expiry), [dotenv](https://github.com/motdotla/dotenv)

### Frontend (`packages/client`)

- **Framework**: [React 19](https://react.dev/), TypeScript
- **Build tool**: [Vite](https://vite.dev/)
- **Data fetching**: [TanStack Query](https://tanstack.com/query) + [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-variable theme, no `tailwind.config.js`), [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css)
- **UI components**: hand-written [shadcn](https://ui.shadcn.com/)-style primitives built on [Radix UI](https://www.radix-ui.com/) and [class-variance-authority](https://cva.style/docs)
- **Icons**: [react-icons](https://react-icons.github.io/react-icons/)
- **Fonts**: [Unbounded](https://fonts.google.com/specimen/Unbounded) (headings) and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body), via Google Fonts
- **Loading states**: [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton)

### Tooling (repo-wide)

- **Package manager**: [Bun workspaces](https://bun.sh/docs/install/workspaces) (`bun.lock`)
- **Formatting / linting**: [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) (client only)
- **Git hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)
- **Local dev orchestration**: [concurrently](https://github.com/open-cli-tools/concurrently), [Docker Compose](https://docs.docker.com/compose/) (Postgres container)

## Setup

```bash
bun install
docker-compose up -d
bun run dev
```

See `CLAUDE.md` for detailed architecture notes and developer gotchas.
