import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApiExecuteResult } from '@sudobility/raidr_types';
import { Badge, Button, Card, Text } from '@sudobility/components';
import { CopyBlock } from '@/components/CopyBlock';

/** What the upstream answered: status, timing, URL, headers (collapsed) and body. */
export function ResponseView({ result }: { result: ApiExecuteResult }) {
  const { t } = useTranslation();
  const [showHeaders, setShowHeaders] = useState(false);
  const ok = result.status >= 200 && result.status < 300;
  const headerText = Object.entries(result.headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return (
    <Card variant="bordered" padding="md" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={ok ? 'success' : result.status >= 500 ? 'danger' : 'warning'}>
          {result.status} {result.statusText}
        </Badge>
        <Text size="sm" color="muted">
          {t('api.result.time', '{{ms}} ms', { ms: result.durationMs })}
        </Text>
        {result.contentType ? (
          <Text size="sm" color="muted" className="font-mono">
            {result.contentType}
          </Text>
        ) : null}
      </div>
      <code className="block font-mono text-xs break-all text-muted-foreground">
        {result.method} {result.url}
      </code>
      <Button type="button" size="sm" variant="ghost" onClick={() => setShowHeaders(s => !s)}>
        {showHeaders
          ? t('api.result.hideHeaders', 'Hide headers')
          : t('api.result.showHeaders', 'Show headers')}
      </Button>
      {showHeaders ? <CopyBlock code={headerText || '(none)'} language="http" /> : null}
      {result.body ? (
        <CopyBlock
          code={result.body}
          language={/json/i.test(result.contentType ?? '') ? 'json' : 'text'}
        />
      ) : (
        <Text size="sm" color="muted">
          {t('api.result.empty', 'Empty body.')}
        </Text>
      )}
      {result.bodyTruncated ? (
        <Text size="xs" color="muted">
          {t('api.result.truncated', 'The body was cut off at 1 MB.')}
        </Text>
      ) : null}
    </Card>
  );
}
