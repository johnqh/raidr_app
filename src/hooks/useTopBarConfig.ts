import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MenuItemConfig, TopBarConfig } from '@sudobility/building_blocks';
import { CubeIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { LinkWrapper } from '@/components/layout/LinkWrapper';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { isLanguageSupported, SUPPORTED_LANGUAGES } from '@/i18n';

/**
 * Sticky `base` top bar with the three catalog links. The language selector
 * hides itself while only one language is supported.
 */
export function useTopBarConfig(): TopBarConfig {
  const { t } = useTranslation();
  const { navigate, switchLanguage, currentLanguage } = useLocalizedNavigate();

  const menuItems: MenuItemConfig[] = useMemo(
    () => [
      { id: 'mcps', label: t('nav.mcps', 'MCP servers'), icon: CubeIcon, href: '/mcps' },
      { id: 'skills', label: t('nav.skills', 'Skills'), icon: DocumentTextIcon, href: '/skills' },
      { id: 'sites', label: t('nav.sites', 'Sites'), icon: GlobeAltIcon, href: '/sites' },
    ],
    [t]
  );

  return {
    variant: 'base',
    logo: { src: '/logo.png', appName: t('app.name', 'raidr'), onClick: () => navigate('/') },
    menuItems,
    currentLanguage,
    onLanguageChange: (lang: string) => {
      if (isLanguageSupported(lang)) switchLanguage(lang);
    },
    hideLanguageSelector: SUPPORTED_LANGUAGES.length < 2,
    collapseBelow: 'md',
    LinkComponent: LinkWrapper,
    sticky: true,
    zIndex: 'highest',
  };
}
