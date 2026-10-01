/**
 * @fileoverview Shown on an MCP page to signed-out visitors instead of the tools and connection setup.
 */
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Heading, Text } from '@sudobility/components';
import { LocalizedLink } from '@/components/layout/LocalizedLink';

export function SignInPrompt() {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const location = useLocation();
  const redirect = encodeURIComponent(location.pathname);
  return (
    <Card variant="bordered" padding="lg" className="text-center">
      <Heading level={2} size="xl" className="mb-2">
        {t('signInPrompt.title', 'Sign in to see the full MCP server')}
      </Heading>
      <Text color="muted" className="max-w-xl mx-auto mb-6">
        {t(
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
