import { useLocalizedNavigate as useSharedLocalizedNavigate } from '@sudobility/components';
import { isLanguageSupported, type SupportedLanguage } from '@/i18n';

/**
 * `@sudobility/components`' localized navigate, bound to this app's
 * languages and `language` storage key and narrowed to SupportedLanguage.
 * `navigate('/mcps')` goes to `/<current lang>/mcps`.
 */
export function useLocalizedNavigate() {
  const result = useSharedLocalizedNavigate({
    isLanguageSupported,
    defaultLanguage: 'en',
    storageKey: 'language',
  });
  return {
    navigate: result.navigate,
    switchLanguage: result.switchLanguage as (newLanguage: SupportedLanguage) => void,
    currentLanguage: result.currentLanguage as SupportedLanguage,
  };
}
