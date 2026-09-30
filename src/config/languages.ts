/**
 * @fileoverview Supported languages. Add a code here and a matching
 * `public/locales/<code>/app.json` to enable a language.
 */
export const SUPPORTED_LANGUAGES = ['en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
};

export const isLanguageSupported = (lang: string): lang is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
