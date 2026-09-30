# CLAUDE.md — raidr_app

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

Read-only catalog UI for raidr. React 19 + Vite + Tailwind, `SudobilityApp`
shell from `@sudobility/building_blocks`, Cloudflare Pages. Bun only. No CI
workflow on purpose; deploy with `bun run deploy`.

## Purpose and layer position

```
raidr_types → raidr_client → raidr_lib → raidr_app (this repo)
```

Public, login-free browser for published MCP servers, agent skills and crawled
sites, with copy-ready connection and install commands. `package.json` is
`"private": true` (name `raidr_app`, version 0.1.1): nothing is published to
npm. Depends on `@sudobility/raidr_lib` ^0.1.1, `@sudobility/raidr_client` ^0.1.0
and `@sudobility/raidr_types` ^0.1.2 from npm.

**Release.** `scripts/push_all.sh` (this repo) drives the whole raidr family, in
order (`path:wait`): `raidr_types:60 → raidr_processor:60 → raidr_client:60 →
raidr_lib:60 → raidr_crawler:0 → raidr_cli:0 → raidr_extension:0 → raidr_api:0 →
raidr_app:0 → raidr_web:0`. It sources `../workflows/scripts/push_projects.sh`
(or downloads it), which per repo updates `@sudobility` deps, validates, bumps
the patch version, commits and pushes, and after a publish polls npm until the
new version is served (the number is a cap). Never run it unasked. This repo
has no `.github/` workflow, so a push deploys nothing: the site ships only via
`bun run deploy` (`wrangler pages deploy dist --project-name raidr-app`).

## Commands

Every command below was run on 2026-09-30 after the documentation pass, except
where noted.

| Command | What it does | Result |
| --- | --- | --- |
| `bun run verify` | typecheck → lint → test:unit → build | exit 0 |
| `bun run typecheck` | `tsc -b` (app + node configs; includes tests) | exit 0 |
| `bun run lint` | `eslint .` (ignores `dist`, `scripts`) | exit 0 |
| `bun run test:unit` | Vitest once, happy-dom, `src/test/setup.ts` | 2 files, 2 tests pass |
| `bun run build` | `tsc -b && vite build` → `dist/` | exit 0 |
| `bun run dev` | Vite on http://localhost:5194 | served `/` and `/locales/en/app.json` (200) |
| `bun run preview` | serve `dist/` on :4173 | served `/` (200) |
| `bun run format:check` | Prettier on `src/**/*.{ts,tsx,css}` | **exit 1: 14 files already unformatted** (not part of verify) |
| `bun run format` | rewrite those files | not run (would reformat untouched code) |
| `bun run deploy` | publish `dist/` to Cloudflare Pages | not run (deploys to production) |

## File map

```
src/
├── main.tsx                  await initializeApp(), then import('./App') and render
├── App.tsx                   SudobilityApp, AppProviders, route table
├── i18n.ts                   i18next: http backend, namespace `app`, initializeI18n()
├── index.css                 Tailwind layers + `.skill-markdown` styles
├── config/
│   ├── initialize.ts         boot: theme CSS → initializeWebApp
│   ├── constants.ts          CONSTANTS from VITE_* with defaults
│   └── languages.ts          SUPPORTED_LANGUAGES = ['en'], isLanguageSupported
├── context/
│   ├── ApiContext.tsx        ApiProvider { networkClient, baseUrl }
│   └── apiContextDef.ts      ApiContext, useApi()
├── hooks/                    useTopBarConfig, useFooterConfig, useLocalizedNavigate, useDocumentLanguage
├── components/
│   ├── PageState.tsx         Loading, EmptyState, ErrorState
│   ├── SearchPagination.tsx  SearchBar (300 ms debounce), Pagination
│   ├── ConnectDocs.tsx       endpoint, token input, Claude Code / Desktop / Cursor tabs
│   ├── ToolsTable.tsx        manifest tools
│   ├── CopyBlock.tsx, Markdown.tsx
│   └── layout/               ScreenContainer, Section, ErrorBoundary, LocalizedLink, LinkWrapper
├── pages/                    one lazy default export per route (+ NotFoundPage.test.tsx)
└── test/setup.ts
public/locales/en/app.json    all UI text
public/_redirects             `/ /en 308`, SPA fallback `/* /index.html 200`
scripts/push_all.sh           family release script (see above)
wrangler.toml                 Pages project `raidr-app`, output `./dist`
```

## Boot and shell

- `src/main.tsx` → `initializeApp()` (theme CSS via `configureTheme` +
  `generateThemeCSS`, then di_web's `initializeWebApp` with the Firebase
  config: storage, Firebase Analytics, network, info, i18n, service worker)
  → dynamic `import('./App')`.
  - Theme is `defaultTheme` from `@sudobility/design/themes`, injected as
    `<style id="sudobility-design-theme">`; the Tailwind preset's semantic
    classes resolve to those CSS variables.
  - `initializeWebApp` order (from di_web source): storage → Firebase app →
    Firebase Analytics → network → info → (RevenueCat, skipped: no
    `revenueCatConfig`) → `initializeI18n` → `registerServiceWorker: true`.
- `src/App.tsx`: `SudobilityApp` with its default page tracker (Firebase
  Analytics `page_view`) and `AppProviders` = `ApiProvider`. Routes sit under
  `/:lang` behind `LanguageValidator` / `LanguageRedirect`. SudobilityApp also
  provides the QueryClient, theme, toasts, network status and router.
- `src/context/ApiContext.tsx` supplies `{ networkClient, baseUrl }` from
  `@sudobility/di/web` and `VITE_API_URL`; every page passes it to
  `raidr_lib` hooks.
- Layout: `ScreenContainer` → `AppPageLayout` with a `base` top bar and a
  compact footer. Each page wraps content in `Section` (max-w-7xl, padded).

## Rules

- Firebase Analytics is always on (via di_web). Firebase Auth and
  subscriptions are not used: never add `SudobilityAppWithFirebaseAuth`,
  `auth_lib` or RevenueCat.
- Data and derived state come from `@sudobility/raidr_lib` hooks; components
  only render. Presentation helpers for tools live in raidr_lib too.
  (Exception today: `HomePage` calls raidr_client's list hooks with `limit: 1`
  just to read `pagination.totalCount`.)
- The token typed on an MCP page stays in component state and only fills the
  copy snippets.
- Prose goes in `public/locales/en/app.json` with a default in the `t()` call.
  Every `t()` key in `src/` currently exists in `app.json` and vice versa.
- Grid children need `[&>*]:min-w-0` so wide code blocks do not break mobile.
- Internal links use `LocalizedLink` (or `useLocalizedNavigate`) with a
  language-less path (`/mcps`); route params are `encodeURIComponent`-ed.

## Environment (`.env`, gitignored; template `.env.example`)

| Variable | Used in | Default when unset |
| --- | --- | --- |
| `VITE_API_URL` | `CONSTANTS.API_URL` → `ApiProvider` (every data hook) and the HomePage example | `https://api.raidr.app` (trailing `/` stripped) |
| `VITE_COMPANY_NAME` | `CONSTANTS.COMPANY_NAME` → footer | `Sudobility` |
| `VITE_APP_NAME`, `VITE_APP_DOMAIN`, `VITE_SUPPORT_EMAIL` | `CONSTANTS` only; nothing reads them yet | `raidr`, `raidr.app`, `support@raidr.app` |
| `VITE_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID` | `initializeWebApp({ firebaseConfig })` (Analytics only) | none |

For a local raidr_api set `VITE_API_URL=http://localhost:3000`.

## Routes (`App.tsx`, all pages lazy)

| Path | Component | Data |
| --- | --- | --- |
| `/` | `LanguageRedirect` (Pages also 308s `/` → `/en`) | — |
| `/:lang` | `HomePage` | `useRaidrMcps/Skills/Sites({ limit: 1 })` |
| `/:lang/mcps` | `McpListPage` | `useMcpCatalog` |
| `/:lang/mcps/:apiHost` | `McpDetailPage` | `useMcp` + `useSiteCatalog({ apiHost })` |
| `/:lang/skills` | `SkillListPage` | `useSkillCatalog` |
| `/:lang/skills/:apiHost` | `SkillDetailPage` | `useSkill` |
| `/:lang/sites` | `SiteListPage` | `useSiteCatalog` |
| `/:lang/sites/:origin` | `SiteDetailPage` | `useSite` (origin decoded by the router) |
| `/:lang/404` | `NotFoundPage` | — |
| `/:lang/*` | `NotFoundRedirect` → `/:lang/404` | — |
| `*` (bad language) | `LanguageRedirect` | — |

## Page states

Every data page renders in this order:

```tsx
if (isLoading) return <Loading />;
if (error) return <ErrorState error={error} />;          // API failed / unreachable
if (notFound || !record) return <EmptyState title={t('…notFound', '…')} />;
```

List pages do the same inline (`catalog.isLoading ? … : catalog.error ? … :
items.length === 0 ? <EmptyState> : grid`) and always render `Pagination`,
which hides itself when `totalCount === 0`. `notFound` vs `error` comes from
raidr_lib's `detailState`: a 404 `NetworkError` is not-found, anything else
(status 0 = unreachable) is an error. `ErrorBoundary` wraps routes and each
page's Suspense, and says "new version" for a failed lazy chunk.

## How to add a page / hook / API call, end to end

1. **raidr_types**: request/response types.
2. **raidr_client**: endpoint in `createApiConfig`, `RaidrClient` method, key in
   `queryKeys.raidr`, `useRaidrX` hook, exports, `MockNetworkClient` test.
3. **raidr_lib**: `useX({ networkClient, baseUrl, … })` wrapping it, with
   `detailState` for detail lookups; pure helpers in `src/utils` with tests;
   export from `src/index.ts`.
4. Publish in order (push_all.sh, when the user asks) so raidr_app can install
   the new versions; then bump the ranges here and `bun install`.
5. **raidr_app**: `src/pages/XPage.tsx` (default export, `useApi()` → hook,
   Loading/ErrorState/EmptyState), a `lazy()` import and `<Route>` in `App.tsx`,
   strings in `public/locales/en/app.json` with the same defaults in `t()`, a
   nav entry in `useTopBarConfig`/`useFooterConfig` if it is top-level.
6. `bun run verify`; open the page in `bun run dev` at desktop and phone widths.

**Trying an unpublished raidr_lib/raidr_client.** Build it there, then replace
`node_modules/@sudobility/<pkg>/dist` here with that `dist` (or `bun link`).
`vite.config.ts` excludes both from `optimizeDeps` and un-ignores
`node_modules/@sudobility/**` in the dev watcher, so dev picks the copy up. The
next `bun install` restores the npm copy; ship only against published versions.

## Gotchas

- `vite.config.ts` dedupes React, TanStack Query, the `@sudobility` UI packages,
  Firebase and both raidr packages: two copies of raidr_lib would mean two
  catalog filter stores.
- `format:check` fails on 14 existing files; `verify` does not run it. Do not
  reformat untouched files as a side effect.
- `src/` imports none of `@sudobility/auth-components`, `subscription-components`,
  `subscription_lib`, `entity_client`, `devops-components`; they match optional
  peers of building_blocks. Check the build before removing any.
- `.npmrc` sets `legacy-peer-deps=true` and reads `NPM_TOKEN`.
- `ErrorBoundary` is a class and calls `i18n.t` directly (no hooks in classes).
- `SearchBar` seeds its draft from `search` once; it does not re-sync if the
  store's search changes elsewhere.
