import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@sudobility/components';
import type { ConnectConfigs } from '@sudobility/raidr_lib';
import { CopyBlock } from './CopyBlock';

interface ConnectDocsProps {
  /** Snippets from raidr_lib's useMcp, already built with the current token. */
  connect: ConnectConfigs;
  /** Manifest auth style; `'none'` hides the token input. */
  authStyle: string;
  /** Lifts the token to the page, which feeds it back to useMcp. */
  onTokenChange: (token: string) => void;
}

/** MCP client setup for the hosted endpoint. The token never leaves the page. */
export function ConnectDocs({ connect, authStyle, onTokenChange }: ConnectDocsProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  return (
    <div className="space-y-4">
      <Text color="muted">
        {t(
          'connect.intro',
          'Add the hosted endpoint to your MCP client. Your site token travels in the {{header}} header and is forwarded to the upstream API on every call; raidr never stores it.',
          { header: connect.headerName }
        )}
      </Text>
      <CopyBlock code={connect.url} language="text" title={t('connect.endpoint', 'MCP endpoint')} />
      {authStyle !== 'none' ? (
        <div className="max-w-md">
          <label className="block text-sm font-medium mb-1" htmlFor="raidr-token">
            {t('connect.tokenLabel', 'Your token (optional, fills the snippets below)')}
          </label>
          <Input
            id="raidr-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={e => {
              setToken(e.target.value);
              onTokenChange(e.target.value);
            }}
            placeholder={t(
              'connect.tokenPlaceholder',
              'Paste the token from the skill instructions'
            )}
          />
        </div>
      ) : (
        <Text size="sm" color="muted">
          {t('connect.noAuth', 'This API needs no token.')}
        </Text>
      )}
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
