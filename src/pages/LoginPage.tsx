/**
 * @fileoverview Sign in / sign up with email or Google (Firebase Auth).
 *
 * Uses building_blocks' LoginPage. After sign-in the user returns to where
 * they came from (?redirect=) or goes to the dashboard.
 */
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStatus } from '@sudobility/auth-components';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { LoginPage as LoginPageComponent } from '@sudobility/building_blocks';
import { EmptyState, Loading } from '@/components/PageState';
import { CONSTANTS } from '@/config/constants';

/** Only same-app paths are accepted as a post-login destination. */
function safeRedirect(value: string | null, lang: string): string {
  return value && value.startsWith(`/${lang}/`) ? value : `/${lang}/dashboard`;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuthStatus();
  const navigate = useNavigate();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const [params] = useSearchParams();
  const destination = safeRedirect(params.get('redirect'), lang);
  const auth = getFirebaseAuth();

  useEffect(() => {
    if (!loading && user) navigate(destination, { replace: true });
  }, [user, loading, navigate, destination]);

  if (loading) return <Loading />;
  if (!auth) {
    return (
      <EmptyState
        title={t('login.notConfigured', 'Sign-in is not available')}
        description={t(
          'login.notConfiguredHint',
          'Firebase is not configured for this deployment.'
        )}
      />
    );
  }

  return (
    <LoginPageComponent
      appName={CONSTANTS.APP_NAME}
      logo={<img src="/logo.png" alt={CONSTANTS.APP_NAME} className="h-12" />}
      onEmailSignIn={async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      }}
      onEmailSignUp={async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
      }}
      onPasswordReset={async email => {
        await sendPasswordResetEmail(auth, email);
      }}
      onGoogleSignIn={async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
      }}
      onSuccess={() => navigate(destination, { replace: true })}
    />
  );
}
