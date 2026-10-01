/**
 * @fileoverview Requires a signed-in user; otherwise sends them to the login page.
 */
import type { ReactNode } from 'react';
import { ProtectedRoute as SharedProtectedRoute } from '@sudobility/components';
import { useAuthStatus } from '@sudobility/auth-components';
import { Loading } from '@/components/PageState';

/** Wraps dashboard routes. Unauthenticated visitors go to /:lang/login. */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStatus();
  return (
    <SharedProtectedRoute
      isAuthenticated={!!user}
      isLoading={loading}
      redirectPath="/:lang/login"
      loadingComponent={<Loading />}
    >
      {children}
    </SharedProtectedRoute>
  );
}
