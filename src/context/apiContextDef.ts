import { createContext, useContext } from 'react';
import type { NetworkClient } from '@sudobility/types';

export interface ApiContextValue {
  networkClient: NetworkClient;
  baseUrl: string;
}

export const ApiContext = createContext<ApiContextValue | null>(null);

export function useApi(): ApiContextValue {
  const value = useContext(ApiContext);
  if (!value) throw new Error('useApi must be used inside ApiProvider');
  return value;
}
