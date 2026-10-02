/**
 * @fileoverview Shown on an MCP page to signed-out visitors instead of the tools and connection setup.
 */
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Heading, Text } from '@sudobility/components';
import { LocalizedLink } from '@/components/layout/LocalizedLink';

/** Defaults to the MCP wording; the API pages pass their own `title`/`description`. */
export function SignInPrompt({
  title,
  description,
}: { title?: string; description?: string } = {}) {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const location = useLocation();
  // Keep the query: /api?domain=… and /endpoint?endpoint=… live in it.
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
  return (
    <Card variant="bordered" padding="lg" className="text-center">
      <Heading level={2} size="xl" className="mb-2">
        {title ?? t('signInPrompt.title', 'Sign in to see the full MCP server')}
      </Heading>
      <Text color="muted" className="max-w-xl mx-auto mb-6">
        {description ??
          t(
            'signInPrompt.description',
            'The tools, request mappings and connection setup are available to signed-in users. Sign in, create an API key for your organization, and connect any MCP client.'
          )}
      </Text>
      <LocalizedLink to={`/login?redirect=${redirect}`}>
        <Button size="lg">{t('signInPrompt.action', 'Sign in')}</Button>
      </LocalizedLink>
      <Text size="xs" color="muted" className="mt-4">
        {t('signInPrompt.lang', 'Free to sign up.')} <span className="sr-only">{lang}</span>
      </Text>
    </Card>
  );
}
