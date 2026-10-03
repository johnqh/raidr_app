/**
 * @fileoverview Shown on a page to signed-out visitors in place of what needs
 * an account (MCP tools and connection setup, API endpoints, the playground,
 * the dashboard). Its button opens the sign-in modal over the page; signing in
 * re-renders the page with its signed-in content. It never goes to `/login`.
 */
import { useTranslation } from 'react-i18next';
import { Button, Card, Heading, Text } from '@sudobility/components';
import { useSignInModal } from '@/components/auth/signInContext';

/** Defaults to the MCP wording; other pages pass their own `title`/`description`. */
export function SignInPrompt({
  title,
  description,
}: { title?: string; description?: string } = {}) {
  const { t } = useTranslation();
  const { openSignIn } = useSignInModal();
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
      <Button size="lg" onClick={() => openSignIn()}>
        {t('signInPrompt.action', 'Sign in')}
      </Button>
      <Text size="xs" color="muted" className="mt-4">
        {t('signInPrompt.lang', 'Free to sign up.')}
      </Text>
    </Card>
  );
}
