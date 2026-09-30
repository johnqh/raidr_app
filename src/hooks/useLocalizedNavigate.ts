import { useLocalizedNavigate as useSharedLocalizedNavigate } from '@sudobility/components';
import { isLanguageSupported, type SupportedLanguage } from '@/i18n';

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
