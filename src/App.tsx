/**
 * @fileoverview Root component and route table.
 *
 * SudobilityApp supplies the providers (i18n, theme, network status, TanStack
 * Query, toasts, router) and its default PageTracker, which sends a Firebase
 * Analytics page_view per navigation. Every page is lazy-loaded and lives
 * under `/:lang`.
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { SudobilityApp } from '@sudobility/building_blocks';
import { LanguageRedirect, LanguageValidator } from '@sudobility/components';
import i18n, { isLanguageSupported } from './i18n';
import { ApiProvider } from './context/ApiContext';
import ScreenContainer from './components/layout/ScreenContainer';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Loading } from './components/PageState';
import { useDocumentLanguage } from './hooks/useDocumentLanguage';

const HomePage = lazy(() => import('./pages/HomePage'));
const McpListPage = lazy(() => import('./pages/McpListPage'));
const McpDetailPage = lazy(() => import('./pages/McpDetailPage'));
const SkillListPage = lazy(() => import('./pages/SkillListPage'));
const SkillDetailPage = lazy(() => import('./pages/SkillDetailPage'));
const SiteListPage = lazy(() => import('./pages/SiteListPage'));
const SiteDetailPage = lazy(() => import('./pages/SiteDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** App-specific providers SudobilityApp mounts inside its own (outside the router). */
function AppProviders({ children }: { children: ReactNode }) {
  return <ApiProvider>{children}</ApiProvider>;
}

/** Keeps `<html lang/dir>` in step with the active language. */
function DocumentLanguageSync({ children }: { children: ReactNode }) {
  useDocumentLanguage();
  return <>{children}</>;
}

/** Unknown path under a valid language: redirect to that language's 404 page. */
function NotFoundRedirect() {
  const { lang } = useParams();
  return <Navigate to={`/${lang ?? 'en'}/404`} replace />;
}

/**
 * Top bar + footer around every page. The inner ErrorBoundary and Suspense
 * keep the shell visible while a page chunk loads or fails.
 */
function ScreenContainerLayout() {
  return (
    <ScreenContainer>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </ScreenContainer>
  );
}

/**
 * `/` and paths with an unsupported first segment go to LanguageRedirect;
 * LanguageValidator checks `:lang` and remembers it under the `language`
 * storage key (the same key i18n.ts reads).
 */
function AppRoutes() {
  return (
    <DocumentLanguageSync>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={<LanguageRedirect isLanguageSupported={isLanguageSupported} />}
            />
            <Route
              path="/:lang"
              element={
                <LanguageValidator
                  isLanguageSupported={isLanguageSupported}
                  defaultLanguage="en"
                  storageKey="language"
                />
              }
            >
              <Route element={<ScreenContainerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="mcps" element={<McpListPage />} />
                <Route path="mcps/:apiHost" element={<McpDetailPage />} />
                <Route path="skills" element={<SkillListPage />} />
                <Route path="skills/:apiHost" element={<SkillDetailPage />} />
                <Route path="sites" element={<SiteListPage />} />
                <Route path="sites/:origin" element={<SiteDetailPage />} />
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundRedirect />} />
              </Route>
            </Route>
            <Route
              path="*"
              element={<LanguageRedirect isLanguageSupported={isLanguageSupported} />}
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </DocumentLanguageSync>
  );
}

/** Root component, rendered by main.tsx once initializeApp() has resolved. */
export default function App() {
  return (
    <SudobilityApp
      i18n={i18n}
      AppProviders={AppProviders}
      LoadingFallback={Loading}
      storageKeyPrefix="raidr"
    >
      <AppRoutes />
    </SudobilityApp>
  );
}
