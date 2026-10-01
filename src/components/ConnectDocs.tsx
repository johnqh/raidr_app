/**
 * @fileoverview MCP client setup for the hosted endpoint.
 *
 * Two credentials: the user's raidr API key (Authorization: Bearer raidr_…),
 * which gets them into raidr's MCP server, and their token for the upstream
 * site (X-Raidr-Token), which raidr forwards and never stores. Both inputs only
 * fill the snippets below; nothing typed here leaves the page.
 */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@sudobility/components';
import type { ConnectConfigs } from '@sudobility/raidr_lib';
import { useCurrentEntityOptional } from '@sudobility/entity_client';
import { LocalizedLink } from '@/components/layout/LocalizedLink';
import { CopyBlock } from './CopyBlock';

interface ConnectDocsProps {
  /** Snippets from raidr_lib's useMcp, already built with the current inputs. */
  connect: ConnectConfigs;
  /** False when the upstream API needs no site token (manifest auth style "none"). */
  needsSiteToken: boolean;
  /** Lift the raidr API key to the page, which feeds it back to useMcp. */
  onApiKeyChange: (apiKey: string) => void;
  /** Lift the site token to the page, which feeds it back to useMcp. */
  onSiteTokenChange: (token: string) => void;
}

export function ConnectDocs({
  connect,
  needsSiteToken,
  onApiKeyChange,
  onSiteTokenChange,
}: ConnectDocsProps) {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const entitySlug = useCurrentEntityOptional()?.currentEntitySlug;
  const apiKeysPath = entitySlug ? `/dashboard/${entitySlug}/api-keys` : '/dashboard';
  const [apiKey, setApiKey] = useState('');
  const [siteToken, setSiteToken] = useState('');

  return (
    <div className="space-y-4">
      <Text color="muted">
        {t(
          'connect.intro',
          'Add the hosted endpoint to your MCP client with two headers: your raidr API key, and your own token for the site. raidr forwards the site token to the upstream API on every call and never stores either.'
        )}
      </Text>
      <CopyBlock code={connect.url} language="text" title={t('connect.endpoint', 'MCP endpoint')} />
      <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="raidr-api-key">
            {t('connect.apiKeyLabel', 'Your raidr API key')}
          </label>
          <Input
            id="raidr-api-key"
            type="password"
            autoComplete="off"
            value={apiKey}
            placeholder="raidr_…"
            onChange={e => {
              setApiKey(e.target.value);
              onApiKeyChange(e.target.value);
            }}
          />
          <Text size="xs" color="muted" className="mt-1">
            <LocalizedLink to={apiKeysPath} className="text-primary underline">
              {t('connect.createKey', 'Create an API key')}
            </LocalizedLink>
            <span className="sr-only">{lang}</span>
          </Text>
        </div>
        {needsSiteToken ? (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="raidr-site-token">
              {t('connect.tokenLabel', 'Your site token')}
            </label>
            <Input
              id="raidr-site-token"
              type="password"
              autoComplete="off"
              value={siteToken}
              placeholder={t('connect.tokenPlaceholder', 'From the skill instructions')}
              onChange={e => {
                setSiteToken(e.target.value);
                onSiteTokenChange(e.target.value);
              }}
            />
          </div>
        ) : (
          <Text size="sm" color="muted" className="self-end">
            {t('connect.noAuth', 'This API needs no site token.')}
          </Text>
        )}
      </div>
      <Tabs defaultValue="claude-code">
        <TabsList>
          <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
          <TabsTrigger value="claude-desktop">Claude Desktop</TabsTrigger>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
        </TabsList>
        <TabsContent value="claude-code">
          <CopyBlock code={connect.claudeCode.cli} title={t('connect.cli', 'One command')} />
          <CopyBlock code={connect.claudeCode.json} language="json" title=".mcp.json" />
        </TabsContent>
        <TabsContent value="claude-desktop">
          <CopyBlock
            code={connect.claudeDesktop.json}
            language="json"
            title="claude_desktop_config.json"
          />
        </TabsContent>
        <TabsContent value="cursor">
          <CopyBlock code={connect.cursor.json} language="json" title=".cursor/mcp.json" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
