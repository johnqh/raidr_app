/**
 * The credential an endpoint needs. For user auth: a button that opens the
 * site's sign-in page in a popup (the browser's web view), the token field the
 * user pastes into, and a hint saying where to copy it from. For API keys: the
 * key field and its hint. Both are remembered in this browser per API host
 * unless "Remember" is off.
 */
import { useTranslation } from 'react-i18next';
import type { ApiDoc, EndpointAuth } from '@sudobility/raidr_types';
import { Alert, Button, Checkbox, Input, Label, Text } from '@sudobility/components';

interface CredentialPanelProps {
  auth: EndpointAuth;
  doc: ApiDoc;
  userToken: string;
  onUserToken: (token: string) => void;
  apiKey: string;
  onApiKey: (key: string) => void;
  remember: boolean;
  onRemember: (on: boolean) => void;
  onOpenLogin: () => boolean;
}

export function CredentialPanel(props: CredentialPanelProps) {
  const { t } = useTranslation();
  const { auth, doc } = props;
  if (auth === 'none') {
    return (
      <Text color="muted" size="sm">
        {t('api.cred.none', 'This endpoint needs no credentials.')}
      </Text>
    );
  }
  const site = doc.auth.user?.loginUrl ?? doc.siteOrigins[0] ?? '';
  const siteName = site ? new URL(site).hostname.replace(/^www\./, '') : doc.apiHost;

  return (
    <div className="space-y-3">
      {auth === 'user' ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!props.onOpenLogin()) window.open(site, '_blank', 'noopener');
              }}
              disabled={!site}
            >
              {t('api.cred.signIn', 'Sign in to {{site}}', { site: siteName })}
            </Button>
            <Text size="sm" color="muted">
              {t(
                'api.cred.signInHint',
                'Opens the site in a small window. Sign in there, then paste your token below.'
              )}
            </Text>
          </div>
          {doc.auth.user?.tokenHint ? (
            <Alert variant="info" title={t('api.cred.whereTitle', 'Where to find your token')}>
              {doc.auth.user.tokenHint}
            </Alert>
          ) : null}
          <div>
            <Label htmlFor="cred-user">
              {doc.auth.user?.style === 'cookie'
                ? t('api.cred.cookie', 'Session cookie ({{name}})', {
                    name: doc.auth.user.cookieName,
                  })
                : doc.auth.user?.style === 'header'
                  ? t('api.cred.header', 'Token ({{name}} header)', {
                      name: doc.auth.user.headerName,
                    })
                  : t('api.cred.bearer', 'Bearer token')}
            </Label>
            <Input
              id="cred-user"
              type="password"
              autoComplete="off"
              value={props.userToken}
              placeholder={t('api.cred.paste', 'Paste the token here')}
              onChange={e => props.onUserToken(e.target.value.trim())}
            />
          </div>
        </>
      ) : (
        <>
          {doc.auth.apiKey?.hint ? <Alert variant="info">{doc.auth.apiKey.hint}</Alert> : null}
          <div>
            <Label htmlFor="cred-key">
              {t('api.cred.key', 'API key ({{where}} "{{name}}")', {
                where:
                  doc.auth.apiKey?.in === 'query'
                    ? t('api.cred.query', 'query parameter')
                    : t('api.cred.headerWord', 'header'),
                name: doc.auth.apiKey?.name ?? '',
              })}
            </Label>
            <Input
              id="cred-key"
              type="password"
              autoComplete="off"
              value={props.apiKey}
              onChange={e => props.onApiKey(e.target.value.trim())}
            />
          </div>
        </>
      )}
      <Checkbox
        checked={props.remember}
        onChange={props.onRemember}
        label={t('api.cred.remember', 'Remember in this browser')}
        description={t(
          'api.cred.rememberHint',
          'Kept on this device only and sent to raidr only when you press Execute.'
        )}
      />
    </div>
  );
}
