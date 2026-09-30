import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['he', 'fa', 'ur'];

/**
 * Hook that syncs the document's lang and dir attributes with i18n language.
 * Essential for SEO, accessibility, and RTL support.
 */
export function useDocumentLanguage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language || 'en';
    const isRTL = RTL_LANGUAGES.includes(currentLang);

    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dataset.lang = currentLang;
    document.documentElement.dataset.dir = isRTL ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return {
    language: i18n.language || 'en',
    isRTL: RTL_LANGUAGES.includes(i18n.language || 'en'),
    direction: RTL_LANGUAGES.includes(i18n.language || 'en') ? 'rtl' : 'ltr',
  };
}

export default useDocumentLanguage;
