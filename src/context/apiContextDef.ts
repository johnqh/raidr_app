/**
 * @fileoverview Context object and hook, split from ApiContext.tsx so that
 * file exports only a component (react-refresh lint rule).
 */
import { createContext, useContext } from 'react';
import type { NetworkClient } from '@sudobility/types';

/** What every raidr_lib / raidr_client hook needs; spread it into hook options. */
export interface ApiContextValue {
  networkClient: NetworkClient;
  baseUrl: string;
}

/** Null outside ApiProvider, so useApi can fail loudly. */
export const ApiContext = createContext<ApiContextValue | null>(null);

/** `{ networkClient, baseUrl }` for data hooks; throws outside ApiProvider. */
export function useApi(): ApiContextValue {
  const value = useContext(ApiContext);
  if (!value) throw new Error('useApi must be used inside ApiProvider');
  return value;
}
