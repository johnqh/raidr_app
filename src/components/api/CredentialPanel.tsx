/**
 * The credential an endpoint needs. For user auth: a button that opens the
 * site's sign-in page in a popup (the browser's web view), the token field the
 * user pastes into, and a hint saying where to copy it from. For API keys: the
 * key field and its hint. Both are remembered in this browser per API host
 * unless "Remember" is off.
 *
 * With the raidr browser extension installed, "Sign in" goes through it: the
 * extension opens the site, reads the token off the site's own requests once
 * the user is signed in, closes the window and the token is filled in here.
 * Without it, the site in the popup is another origin that raidr cannot read;
 * it only sees the window close, then focuses the token field, and
 * `TokenGuide` walks the user through copying the token by hand.
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApiDoc, EndpointAuth } from '@sudobility/raidr_types';
import { Alert, Button, Checkbox, Input, Label, Text } from '@sudobility/components';
import type { LoginWindowState } from '@sudobility/raidr_lib';
import { CONSTANTS } from '@/config/constants';
import { TokenGuide } from './TokenGuide';

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
  /** The sign-in round trip, from `useEndpointPlayground`. */
  loginWindow: LoginWindowState;
  /** Whether the raidr extension is installed (it fills the token itself). */
  extension: 'checking' | 'available' | 'missing';
  tokenVerified: boolean | null;
}

export function CredentialPanel(props: CredentialPanelProps) {
  const { t } = useTranslation();
  const { auth, doc, loginWindow } = props;
  useEffect(() => {
    if (loginWindow === 'closed') document.getElementById('cred-user')?.focus();
  }, [loginWindow]);
  if (auth === 'none') {
    return (
      <Text color="muted" size="sm">
        {t('api.cred.none', 'This endpoint needs no credentials.')}
      </Text>
    );
  }
  const withExtension = props.extension === 'available';
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
              {withExtension
                ? t(
                    'api.cred.signInHintExt',
                    'The raidr extension opens {{site}}, picks up your token once you are signed in, and closes the window.',
                    { site: siteName }
                  )
                : t(
                    'api.cred.signInHint',
                    'Opens the site in a small window. Sign in there, close it, then paste your token below.'
                  )}
            </Text>
          </div>
          {loginWindow === 'open' ? (
            <p role="status" className="text-sm text-muted-foreground">
              {withExtension
                ? t(
                    'api.cred.waitingExt',
                    'Waiting for you to sign in to {{site}}. The window closes by itself when you are in.',
                    { site: siteName }
                  )
                : t(
                    'api.cred.waiting',
                    'Waiting for you to sign in to {{site}}. Close that window when you are done.',
                    { site: siteName }
                  )}
            </p>
          ) : null}
          {loginWindow === 'captured' ? (
            <Alert
              variant="success"
              title={t('api.cred.capturedTitle', 'Signed in to {{site}}', { site: siteName })}
            >
              {props.tokenVerified === false
                ? t(
                    'api.cred.capturedUnverified',
                    'Your token is filled in, but raidr could not confirm it yet. Press Execute to check; if the API answers 401, sign in again.'
                  )
                : t('api.cred.capturedBody', 'Your token is filled in. You can press Execute.')}
            </Alert>
          ) : null}
          {loginWindow === 'closed' ? (
            withExtension ? (
              <Alert variant="warning" title={t('api.cred.notSignedTitle', 'No sign-in seen')}>
                {t(
                  'api.cred.notSignedBody',
                  'The {{site}} window closed before raidr saw you signed in. Try again, or copy the token by hand as described below.',
                  { site: siteName }
                )}
              </Alert>
            ) : (
              <Alert variant="success" title={t('api.cred.closedTitle', 'Signed in?')}>
                {t(
                  'api.cred.closedBody',
                  'The {{site}} window is closed. Copy your token from {{site}} as described below and paste it into the field.',
                  { site: siteName }
                )}
              </Alert>
            )
          ) : null}
          {props.extension === 'missing' ? (
            <Alert variant="info" title={t('api.cred.extTitle', 'Skip the copying')}>
              <span>
                {t(
                  'api.cred.extBody',
                  'With the raidr browser extension, raidr fills in your token itself once you sign in. Installed it already? Reload this page.'
                )}{' '}
                <a
                  href={CONSTANTS.EXTENSION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-2"
                >
                  {t('api.cred.extLink', 'Get the raidr extension')}
                </a>
              </span>
            </Alert>
          ) : null}
          {doc.auth.user?.tokenHint ? (
            <Alert variant="info" title={t('api.cred.whereTitle', 'Where to find your token')}>
              {doc.auth.user.tokenHint}
            </Alert>
          ) : null}
          {!withExtension || loginWindow === 'closed' ? (
            <TokenGuide auth={doc.auth.user} apiHost={doc.apiHost} siteName={siteName} />
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
