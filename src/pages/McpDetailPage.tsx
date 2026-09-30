import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Badge, Button, Heading, Text } from '@sudobility/components';
import { useMcp, useSiteCatalog } from '@sudobility/raidr_lib';
import { LocalizedLink } from '@/components/layout/LocalizedLink';
import { Section } from '@/components/layout/Section';
import { EmptyState, ErrorState, Loading } from '@/components/PageState';
import { ToolsTable } from '@/components/ToolsTable';
import { ConnectDocs } from '@/components/ConnectDocs';
import { useApi } from '@/context/apiContextDef';

/**
 * `/:lang/mcps/:apiHost`. The typed token is held here only to rebuild the
 * connection snippets via useMcp; it is never sent to the API.
 */
export default function McpDetailPage() {
  const { t } = useTranslation();
  const { apiHost = '' } = useParams();
  const api = useApi();
  const [token, setToken] = useState('');
  const { manifest, tools, skill, connect, isLoading, notFound, error } = useMcp({
    ...api,
    apiHost,
    token,
  });
  const sites = useSiteCatalog({ ...api, apiHost });

  if (isLoading) return <Loading />;
  if (error) return <ErrorState error={error} />;
  if (notFound || !manifest) {
    return (
      <EmptyState title={t('mcp.notFound', 'No MCP published for {{host}}', { host: apiHost })} />
    );
  }

  return (
    <>
      <Section spacing="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Heading level={1} size="3xl">
              {manifest.title}
            </Heading>
            <code className="font-mono text-sm text-muted-foreground">{manifest.apiHost}</code>
            <Text color="muted" className="mt-3 max-w-3xl">
              {manifest.description}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" pill>
              {t('mcp.auth', 'auth: {{style}}', { style: manifest.auth.style })}
            </Badge>
            <Badge variant="info" pill>
              {t('mcps.toolCount', '{{count}} tools', { count: tools.length })}
            </Badge>
            <Badge variant="default" pill>
              v{manifest.version}
            </Badge>
          </div>
        </div>
        {skill ? (
          <Alert
            variant="info"
            className="mt-6"
            title={t('mcp.skillTitle', 'A skill explains how to get a token for this API')}
          >
            <LocalizedLink to={`/skills/${encodeURIComponent(apiHost)}`}>
              <Button size="sm" variant="outline">
                {t('mcp.openSkill', 'Open the skill')}
              </Button>
            </LocalizedLink>
          </Alert>
        ) : null}
      </Section>

      <Section spacing="md">
        <Heading level={2} size="2xl" className="mb-4">
          {t('mcp.connectTitle', 'Connect')}
        </Heading>
        <ConnectDocs connect={connect} authStyle={manifest.auth.style} onTokenChange={setToken} />
      </Section>

      <Section spacing="md">
        <Heading level={2} size="2xl" className="mb-4">
          {t('mcp.toolsTitle', 'Tools')}
        </Heading>
        <ToolsTable tools={tools} />
      </Section>

      <Section spacing="md">
        <Heading level={2} size="xl" className="mb-3">
          {t('mcp.sitesTitle', 'Sites using this API')}
        </Heading>
        {sites.items.length === 0 ? (
          <Text color="muted">{t('mcp.noSites', 'None recorded yet.')}</Text>
        ) : (
          <ul className="space-y-1">
            {sites.items.map(site => (
              <li key={site.origin}>
                <LocalizedLink
                  to={`/sites/${encodeURIComponent(site.origin)}`}
                  className="text-primary underline"
                >
                  {site.title ?? site.origin}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        )}
        <Text size="xs" color="muted" className="mt-6">
          {t('mcp.source', 'Generated {{when}} from {{bundle}} by raidr-crawler {{version}}.', {
            when: new Date(manifest.generatedAt).toLocaleDateString(),
            bundle: manifest.source.bundleName,
            version: manifest.source.crawlerVersion,
          })}
        </Text>
      </Section>
    </>
  );
}
