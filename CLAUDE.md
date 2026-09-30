# CLAUDE.md — raidr_app

Read-only catalog UI for raidr. React 19 + Vite + Tailwind, `SudobilityApp`
shell from `@sudobility/building_blocks`, Cloudflare Pages. Bun only. No CI
workflow on purpose; deploy with `bun run deploy`.

## Boot and shell

- `src/main.tsx` → `initializeApp()` (theme CSS via `configureTheme` +
  `generateThemeCSS`, then i18n) → dynamic `import('./App')`.
- `src/App.tsx`: `SudobilityApp` with `PageTracker={false}` (the default page
  tracker calls Firebase) and `AppProviders` = Helmet + `ApiProvider`. Routes
  sit under `/:lang` behind `LanguageValidator` / `LanguageRedirect`.
- `src/context/ApiContext.tsx` supplies `{ networkClient, baseUrl }` from
  `@sudobility/di/web` and `VITE_API_URL`; every page passes it to
  `raidr_lib` hooks.
- Layout: `ScreenContainer` → `AppPageLayout` with a `base` top bar and a
  compact footer.

## Rules

- Never import `@sudobility/di_web`, Firebase or subscription packages; this
  app has no auth.
- Data and derived state come from `@sudobility/raidr_lib` hooks; components
  only render. Presentation helpers for tools live in raidr_lib too.
- The token typed on an MCP page stays in component state and only fills the
  copy snippets.
- Prose goes in `public/locales/en/app.json` with a default in the `t()` call.
- Grid children need `[&>*]:min-w-0` so wide code blocks do not break mobile.

## Commands

```bash
bun run verify
bun run dev
```
