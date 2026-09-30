# raidr_app

Public web app for browsing raidr MCP servers and agent skills, with
connection docs for Claude Code, Claude Desktop and Cursor, and install docs
for each skill.

React 19 + Vite + Tailwind on the `@sudobility` building blocks, deployed to
Cloudflare Pages. No login: the catalog is public.

## Routes

| Path | Page |
| --- | --- |
| `/:lang` | home: counts and a how-it-works walkthrough |
| `/:lang/mcps`, `/:lang/mcps/:apiHost` | MCP catalog; detail shows tools, connection snippets, linked sites and skill |
| `/:lang/skills`, `/:lang/skills/:apiHost` | skill catalog; detail renders SKILL.md with download and install commands |
| `/:lang/sites`, `/:lang/sites/:origin` | crawled sites and the API hosts they call (origin is URL-encoded) |

## Run

```bash
cp .env.example .env      # VITE_API_URL=http://localhost:3000 for a local raidr_api
bun install
bun run dev               # http://localhost:5194
```

## Verify and deploy

```bash
bun run verify            # typecheck, lint, test, build
bun run deploy            # wrangler pages deploy dist --project-name raidr-app
```

There is no CI workflow for this app by design; deploy from a checkout.

## Layers

`raidr_types` → `raidr_client` → `raidr_lib` → **raidr_app**
