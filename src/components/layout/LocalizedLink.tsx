import { LocalizedLink as SharedLocalizedLink } from '@sudobility/components';
import type { LocalizedLinkProps as SharedLocalizedLinkProps } from '@sudobility/components';
import { isLanguageSupported } from '@/i18n';

type LocalizedLinkProps = Omit<SharedLocalizedLinkProps, 'isLanguageSupported' | 'defaultLanguage'>;

/**
 * Router link that prefixes the current language: `to="/mcps"` renders
 * `/<lang>/mcps`. Use it for every internal link.
 */
export function LocalizedLink(props: LocalizedLinkProps) {
  return (
    <SharedLocalizedLink
      {...props}
      isLanguageSupported={isLanguageSupported}
      defaultLanguage="en"
    />
  );
}
