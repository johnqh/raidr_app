/**
 * Step-by-step help for copying a site token by hand, for when the raidr
 * extension is not installed. Written for someone who has never opened
 * developer tools: which keys, which tab, which row, what to copy.
 */
import { useTranslation } from 'react-i18next';
import type { ApiUserAuth } from '@sudobility/raidr_types';

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
      {children}
    </kbd>
  );
}

export function TokenGuide({
  auth,
  apiHost,
  siteName,
}: {
  auth: ApiUserAuth | undefined;
  apiHost: string;
  siteName: string;
}) {
  const { t } = useTranslation();
  const style = auth?.style ?? 'bearer';
  const headerName = style === 'header' ? (auth?.headerName ?? 'Authorization') : 'Authorization';
  const prefix = style === 'bearer' ? (auth?.tokenPrefix ?? 'Bearer ') : (auth?.tokenPrefix ?? '');

  const openTools = (
    <li>
      {t('api.guide.devtools', 'In that window, open the developer tools:')}{' '}
      <span className="whitespace-nowrap">
        Mac <Kbd>⌥ Option</Kbd> + <Kbd>⌘ Cmd</Kbd> + <Kbd>I</Kbd>
      </span>
      ;{' '}
      <span className="whitespace-nowrap">
        Windows / Linux <Kbd>F12</Kbd>
      </span>{' '}
      {t('api.guide.or', 'or')} <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>I</Kbd>.{' '}
      <span className="text-muted-foreground">
        {t(
          'api.guide.safari',
          'Safari: first turn on Settings › Advanced › "Show features for web developers".'
        )}
      </span>
    </li>
  );

  const steps =
    style === 'cookie' ? (
      <>
        {openTools}
        <li>
          {t(
            'api.guide.cookieTab',
            'Open the Application tab (Firefox and Safari: Storage). It may hide behind the » arrow.'
          )}
        </li>
        <li>
          {t(
            'api.guide.cookieList',
            'In the left column, open Cookies and click the {{site}} entry.',
            {
              site: siteName,
            }
          )}
        </li>
        <li>
          {t('api.guide.cookieRow', 'Find the row named')}{' '}
          <code className="font-mono">{auth?.cookieName ?? 'session'}</code>
          {t('api.guide.cookieCopy', ', double-click its Value and copy it (⌘C / Ctrl+C).')}
        </li>
      </>
    ) : (
      <>
        {openTools}
        <li>
          {t(
            'api.guide.network',
            'Click the Network tab, then reload the page (⌘R / Ctrl+R) so its requests appear.'
          )}
        </li>
        <li>
          {t('api.guide.filter', 'Type this into the filter box at the top of the list:')}{' '}
          <code className="font-mono break-all">{apiHost}</code>
        </li>
        <li>
          {t(
            'api.guide.pick',
            'Click any request in the list. In the panel that opens, choose Headers and scroll to Request Headers.'
          )}
        </li>
        <li>
          {t('api.guide.find', 'Find the line')}{' '}
          <code className="font-mono">
            {headerName}: {prefix}…
          </code>
          {prefix
            ? t(
                'api.guide.copyAfter',
                ' — copy everything after "{{prefix}}" (right-click the value › Copy value, then delete the "{{prefix}}" at the start).',
                { prefix: prefix.trim() }
              )
            : t('api.guide.copyAll', ' — copy its whole value (right-click › Copy value).')}{' '}
          <span className="text-muted-foreground">
            {t(
              'api.guide.noHeader',
              'No such line? Click another request: not every call carries it. Still none means you are not signed in yet.'
            )}
          </span>
        </li>
      </>
    );

  return (
    <div className="rounded-md border border-border p-4 text-sm">
      <p className="font-semibold">{t('api.guide.title', 'How to copy your token by hand')}</p>
      <ol className="mt-2 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          {t(
            'api.guide.signIn',
            'Click "Sign in to {{site}}" above and sign in. If you are already signed in there, the site just opens on your account.',
            { site: siteName }
          )}
        </li>
        {steps}
        <li>{t('api.guide.paste', 'Paste it into the field below. That is all.')}</li>
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        {t(
          'api.guide.safety',
          'This token is your signed-in session on {{site}}: treat it like a password and paste it only here. Tokens expire; if Execute starts answering 401, get a fresh one the same way.',
          { site: siteName }
        )}
      </p>
    </div>
  );
}
