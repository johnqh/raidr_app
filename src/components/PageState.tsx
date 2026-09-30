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
