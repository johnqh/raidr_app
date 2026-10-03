/**
 * @fileoverview The one set of sign-in handlers and words, shared by the
 * `/login` page (building_blocks' `LoginPage`) and the in-flow sign-in modal
 * (components' `LoginModal`), so the two never offer different providers.
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type Auth,
} from 'firebase/auth';
import type { LoginModalText, LoginViewText } from '@sudobility/components';

/** What `LoginPage` adds to the view's words: the heading for each mode. */
export interface SignInPageHeadings {
  createAccount: string;
  signInToAccount: string;
  resetPassword: string;
}

export interface SignInHandlers {
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
  onPasswordReset: (email: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
}

export interface SignInSetup {
  /** Null when this deployment has no Firebase Auth. */
  auth: Auth | null;
  handlers: SignInHandlers;
  viewText: LoginViewText;
  pageHeadings: SignInPageHeadings;
  modalText: LoginModalText;
}

function requireAuth(auth: Auth | null): Auth {
  if (!auth) throw new Error('Firebase Auth is not configured');
  return auth;
}

/** Email/password (with sign-up and password reset) and Google, through Firebase Auth. */
export function useSignIn(): SignInSetup {
  const { t } = useTranslation('auth');
  const auth = getFirebaseAuth();

  return useMemo(() => {
    const handlers: SignInHandlers = {
      onEmailSignIn: async (email, password) => {
        await signInWithEmailAndPassword(requireAuth(auth), email, password);
      },
      onEmailSignUp: async (email, password) => {
        await createUserWithEmailAndPassword(requireAuth(auth), email, password);
      },
      onPasswordReset: async email => {
        await sendPasswordResetEmail(requireAuth(auth), email);
      },
      onGoogleSignIn: async () => {
        await signInWithPopup(requireAuth(auth), new GoogleAuthProvider());
      },
    };
    const viewText: LoginViewText = {
      signIn: t('signIn'),
      signUp: t('signUp'),
      emailLabel: t('email'),
      emailPlaceholder: t('emailPlaceholder'),
      passwordLabel: t('password'),
      passwordPlaceholder: t('passwordPlaceholder'),
      orContinueWith: t('view.orContinueWith'),
      signInWithGoogle: t('continueWithGoogle'),
      signInWithApple: t('view.signInWithApple'),
      alreadyHaveAccount: t('haveAccount'),
      dontHaveAccount: t('noAccount'),
      genericError: t('view.genericError'),
      forgotPassword: t('forgotPassword'),
      resetPasswordHint: t('view.resetPasswordHint'),
      sendResetLink: t('sendResetLink'),
      resetEmailSent: t('view.resetEmailSent'),
      backToSignIn: t('backToSignIn'),
    };
    const pageHeadings: SignInPageHeadings = {
      createAccount: t('createAccount'),
      signInToAccount: t('view.signInToAccount'),
      resetPassword: t('resetPassword'),
    };
    const modalText: LoginModalText = {
      signInTitle: t('signInTitle'),
      signUpTitle: t('createAccount'),
      resetPasswordTitle: t('resetPassword'),
      close: t('close'),
    };
    return { auth, handlers, viewText, pageHeadings, modalText };
  }, [auth, t]);
}
