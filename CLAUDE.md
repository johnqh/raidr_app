# CLAUDE.md — raidr_app

Read-only catalog UI for raidr. React 19 + Vite + Tailwind, `SudobilityApp`
shell from `@sudobility/building_blocks`, Cloudflare Pages. Bun only. No CI
workflow on purpose; deploy with `bun run deploy`.

## Boot and shell

- `src/main.tsx` → `initializeApp()` (theme CSS via `configureTheme` +
  `generateThemeCSS`, then di_web's `initializeWebApp` with the Firebase
  config: storage, Firebase Analytics, network, info, i18n, service worker)
  → dynamic `import('./App')`.
- `src/App.tsx`: `SudobilityApp` with its default page tracker (Firebase
  Analytics `page_view`) and `AppProviders` = `ApiProvider`. Routes sit under
  `/:lang` behind `LanguageValidator` / `LanguageRedirect`.
- `src/context/ApiContext.tsx` supplies `{ networkClient, baseUrl }` from
  `@sudobility/di/web` and `VITE_API_URL`; every page passes it to
  `raidr_lib` hooks.
- Layout: `ScreenContainer` → `AppPageLayout` with a `base` top bar and a
  compact footer.

## Rules

- Firebase Analytics is always on (via di_web). Firebase Auth and
  subscriptions are not used: never add `SudobilityAppWithFirebaseAuth`,
  `auth_lib` or RevenueCat.
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
