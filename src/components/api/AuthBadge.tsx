import { useTranslation } from 'react-i18next';
import type { EndpointAuth } from '@sudobility/raidr_types';
import { Badge } from '@sudobility/components';

/** What an endpoint needs: no auth, a signed-in user, or an API key. */
export function AuthBadge({ auth }: { auth: EndpointAuth }) {
  const { t } = useTranslation();
  if (auth === 'user') {
    return (
      <Badge variant="purple" size="sm" pill>
        {t('api.auth.user', 'User auth')}
      </Badge>
    );
  }
  if (auth === 'api_key') {
    return (
      <Badge variant="warning" size="sm" pill>
        {t('api.auth.apiKey', 'API key')}
      </Badge>
    );
  }
  return (
    <Badge variant="default" size="sm" pill>
      {t('api.auth.none', 'No auth')}
    </Badge>
  );
}
