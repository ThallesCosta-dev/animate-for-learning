# Parapente Lab

Aplicativo educacional em português sobre parapente: aerodinâmica, meteorologia e segurança,
com animações interativas em canvas, gráfico (Chart.js), simulador de voo (Phaser), quiz,
glossário e progresso salvo no navegador.

**App publicado**: https://animate-for-learning.lovable.app

> Ferramenta educacional. Não substitui instrução prática com instrutor habilitado. Os modelos
> físicos são simplificados e os valores numéricos são ilustrativos.

## Stack

- React 19 + TypeScript
- TanStack Start / Router (rotas por arquivo em `src/routes/`)
- Tailwind CSS 4
- Canvas 2D para as simulações (`src/components/aero`, `src/components/meteo`)
- Chart.js (gráfico sustentação × arrasto) e Phaser (simulador de voo), carregados sob demanda

## Desenvolvimento

O projeto usa [bun](https://bun.sh) (há um `bun.lock` versionado). Com npm também funciona, mas
não versione o `package-lock.json`.

```sh
bun install
bun run dev        # servidor de desenvolvimento
bun run build      # build de produção
bun run typecheck  # tsc --noEmit
bun run lint       # eslint
bun run format     # prettier --write
```

## Estrutura

| Pasta                     | Conteúdo                                                         |
| ------------------------- | ---------------------------------------------------------------- |
| `src/routes/`             | páginas (início, aprender, meteorologia, segurança, simulador…) |
| `src/components/`         | `Lesson`, `SimCanvas`, header, simulações por área               |
| `src/lib/`                | modelo físico didático, dados de quiz/glossário, progresso, SEO  |
| `src/hooks/`              | `useProgress`, `useReducedMotion`, navegação por teclado em abas |
| `public/`                 | favicon, imagem do hero, imagem Open Graph, sitemap, robots      |

## Lovable

Este projeto está conectado ao [Lovable](https://lovable.dev/projects/4c68c706-c2ed-45a3-b5b5-eaf062ac5392).
Commits enviados para `main` sincronizam com o editor. Não reescreva o histórico publicado
(force push, rebase ou squash de commits já enviados).
