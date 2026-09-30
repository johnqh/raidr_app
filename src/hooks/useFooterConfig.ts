import { useTranslation } from 'react-i18next';
import type { FooterConfig } from '@sudobility/building_blocks';
import { LinkWrapper } from '@/components/layout/LinkWrapper';
import { CONSTANTS } from '@/config/constants';

/** Compact footer: version from package.json, copyright, and the three catalog links. */
export function useFooterConfig(): FooterConfig {
  const { t } = useTranslation();
  return {
    variant: 'compact',
    version: __APP_VERSION__,
    copyrightYear: String(new Date().getFullYear()),
    companyName: CONSTANTS.COMPANY_NAME,
    companyUrl: '/',
    rightsText: t('footer.rightsText', 'All rights reserved'),
    links: [
      { label: t('nav.mcps', 'MCP servers'), href: '/mcps' },
      { label: t('nav.skills', 'Skills'), href: '/skills' },
      { label: t('nav.sites', 'Sites'), href: '/sites' },
    ],
    LinkComponent: LinkWrapper,
  };
}
