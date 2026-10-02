import { useParams } from 'react-router-dom';
import { LocalizedLink as SharedLocalizedLink } from '@sudobility/components';
import type { LocalizedLinkProps as SharedLocalizedLinkProps } from '@sudobility/components';
import { isLanguageSupported } from '@/i18n';

type LocalizedLinkProps = Omit<SharedLocalizedLinkProps, 'isLanguageSupported' | 'defaultLanguage'>;

/**
 * Router link that prefixes the current language: `to="/mcps"` renders
 * `/<lang>/mcps`. Use it for every internal link.
 *
 * The prefix is added here because the shared component tests
 * `to.startsWith('/en')` as a plain string, so `/endpoint?…` was taken
 * as already prefixed and rendered without a language.
 */
export function LocalizedLink({ to, language, ...props }: LocalizedLinkProps) {
  const { lang } = useParams<{ lang: string }>();
  const current = language ?? (lang && isLanguageSupported(lang) ? lang : 'en');
  const path = to.startsWith('/') ? to : `/${to}`;
  const prefixed = new RegExp(`^/${current}(?:[/?#]|$)`).test(path) ? path : `/${current}${path}`;
  return (
    <SharedLocalizedLink
      {...props}
      to={prefixed}
      language={current}
      isLanguageSupported={isLanguageSupported}
      defaultLanguage="en"
    />
  );
}
