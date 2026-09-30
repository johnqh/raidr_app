/**
 * @fileoverview Supported languages. Add a code here and a matching
 * `public/locales/<code>/app.json` to enable a language.
 */
/** Language codes that may appear as the `/:lang` route segment. */
export const SUPPORTED_LANGUAGES = ['en'] as const;
/** One of SUPPORTED_LANGUAGES. */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Display names for a language picker (hidden while only one language exists). */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
};

/** Type guard used by routing, links and i18n detection. */
export const isLanguageSupported = (lang: string): lang is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
