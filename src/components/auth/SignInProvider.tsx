/**
 * @fileoverview The in-flow sign-in modal, mounted once for every page.
 *
 * The rule: a visitor who *navigates* to sign in (the top bar's Log in) gets
 * the `/login` page; one who meets sign-in in the middle of something else (a
 * signed-out MCP, API or endpoint page, the dashboard) gets `LoginModal` over
 * the page they are on and stays there. Signing in re-renders that page with
 * its signed-in content, and `onSuccess` lets an action carry on. Closing the
 * modal without signing in leaves the page's signed-out view (its
 * `SignInPrompt`) in place. Nothing in the flow redirects to `/login`.
 */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { SignInContext } from './signInContext';
import { LoginModal } from '@sudobility/components';
import { useSignIn } from '@/hooks/useSignIn';

export function SignInProvider({ children }: { children: ReactNode }) {
  const { handlers, viewText, modalText } = useSignIn();
  const [open, setOpen] = useState(false);
  const pending = useRef<(() => void) | undefined>(undefined);

  const openSignIn = useCallback((onSuccess?: () => void) => {
    pending.current = onSuccess;
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ openSignIn }), [openSignIn]);

  return (
    <SignInContext.Provider value={value}>
      {children}
      <LoginModal
        open={open}
        onClose={() => {
          pending.current = undefined;
          setOpen(false);
        }}
        onSuccess={() => {
          const next = pending.current;
          pending.current = undefined;
          next?.();
        }}
        {...handlers}
        text={viewText}
        modalText={modalText}
      />
    </SignInContext.Provider>
  );
}
