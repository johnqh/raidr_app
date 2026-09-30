/**
 * @fileoverview App initialization: theme CSS and i18n. No Firebase, no
 * analytics, no service worker; this app only reads a public catalog.
 */
import { configureTheme } from '@sudobility/design';
import { defaultTheme, generateThemeCSS } from '@sudobility/design/themes';
import { initializeI18n } from '../i18n';

export async function initializeApp(): Promise<void> {
  configureTheme(defaultTheme);
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.id = 'sudobility-design-theme';
    styleEl.textContent = generateThemeCSS(defaultTheme);
    document.head.appendChild(styleEl);
  }
  initializeI18n();
}
