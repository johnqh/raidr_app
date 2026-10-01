# raidr_app

Public web app for browsing raidr MCP servers and agent skills, with
connection docs for Claude Code, Claude Desktop and Cursor, and install docs
for each skill.

React 19 + Vite + Tailwind on the `@sudobility` building blocks, deployed to
Cloudflare Pages. Firebase Auth with organizational entities: browsing MCPs
and skills needs no login, but the full MCP detail does. Signed-in users
manage organizations, members and `raidr_…` API keys in the dashboard, and use
a key to connect any MCP client to `https://api.raidr.app/mcp/<apiHost>`.

## Routes

| Path | Page |
| --- | --- |
| `/:lang` | home: counts and a how-it-works walkthrough |
| `/:lang/mcps`, `/:lang/mcps/:apiHost` | MCP catalog; detail shows the summary signed out, and tools plus connection snippets signed in |
| `/:lang/skills`, `/:lang/skills/:apiHost` | skill catalog; detail renders SKILL.md with a one-line install command |
| `/:lang/sites`, `/:lang/sites/:origin` | crawled sites and the API hosts they call (origin is URL-encoded) |
| `/:lang/login` | sign in (Google or email) |
| `/:lang/dashboard/:entitySlug/{api-keys,workspaces,members,invitations}` | account dashboard, signed in only |

## Run

```bash
cp .env.example .env      # VITE_API_URL, and VITE_FIREBASE_* (required)
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
