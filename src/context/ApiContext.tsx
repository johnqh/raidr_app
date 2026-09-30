/**
 * @fileoverview Network client + API base URL for every data hook.
 * No auth: the catalog is public, so there is no token to carry.
 */
import { useMemo, type ReactNode } from 'react';
import { webNetworkClient } from '@sudobility/di/web';
import { CONSTANTS } from '@/config/constants';
import { ApiContext, type ApiContextValue } from './apiContextDef';

export function ApiProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ApiContextValue>(
    () => ({ networkClient: webNetworkClient, baseUrl: CONSTANTS.API_URL }),
    []
  );
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
