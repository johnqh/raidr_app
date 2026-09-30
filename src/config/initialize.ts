/**
 * @fileoverview App initialization: theme CSS, then DI services via
 * di_web's initializeWebApp (storage, Firebase Analytics, network, info,
 * i18n, service worker). Firebase Auth is not used: the catalog is public.
 */
import { initializeWebApp } from '@sudobility/di_web';
import { configureTheme } from '@sudobility/design';
import { defaultTheme, generateThemeCSS } from '@sudobility/design/themes';
import { initializeI18n } from '../i18n';

/**
 * Boot sequence, awaited by main.tsx before App is imported:
 * 1. theme: configureTheme + generateThemeCSS injected as
 *    `<style id="sudobility-design-theme">`, because the Tailwind preset maps
 *    semantic classes to CSS variables that only this style defines;
 * 2. initializeWebApp: storage, Firebase app + Analytics, network, info,
 *    then `initializeI18n`, then the shared service worker.
 * No `revenueCatConfig` is passed, so subscriptions are never initialized.
 */
export async function initializeApp(): Promise<void> {
  configureTheme(defaultTheme);
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.id = 'sudobility-design-theme';
    styleEl.textContent = generateThemeCSS(defaultTheme);
    document.head.appendChild(styleEl);
  }

  await initializeWebApp({
    firebaseConfig: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
    initializeI18n,
    registerServiceWorker: true,
  });
}
