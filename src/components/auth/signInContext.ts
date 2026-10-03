/**
 * @fileoverview The context `SignInProvider` fills, and `useSignInModal` to read it.
 */
import { createContext, useContext } from 'react';

export interface SignInContextValue {
  /** Opens the sign-in modal over the current page; `onSuccess` runs after signing in. */
  openSignIn: (onSuccess?: () => void) => void;
}

export const SignInContext = createContext<SignInContextValue | null>(null);

/** `openSignIn(onSuccess?)` from the nearest `SignInProvider`. */
export function useSignInModal(): SignInContextValue {
  const value = useContext(SignInContext);
  if (!value) throw new Error('useSignInModal must be used inside SignInProvider');
  return value;
}
