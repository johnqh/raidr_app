import { useTranslation } from 'react-i18next';
import { Spinner, Text } from '@sudobility/components';

export function Loading({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[30vh]" role="status" aria-live="polite">
      <Spinner size="large" {...(label ? { loadingText: label } : {})} />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-16">
      <Text size="lg" weight="medium">
        {title}
      </Text>
      {description ? (
        <Text color="muted" className="mt-2">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

/** The API failed or could not be reached; distinct from a record that does not exist. */
export function ErrorState({ error }: { error: Error }) {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16" role="alert">
      <Text size="lg" weight="medium">
        {t('errors.api.title', 'Could not load this from the raidr API')}
      </Text>
      <Text color="muted" className="mt-2">
        {t('errors.api.description', 'The API may be unreachable. Try again in a moment.')}
      </Text>
      <Text size="xs" color="muted" className="mt-2 font-mono">
        {error.message}
      </Text>
    </div>
  );
}
