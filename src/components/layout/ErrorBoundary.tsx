/**
 * @fileoverview Catches render errors (notably stale lazy chunks after a deploy)
 * and offers a retry instead of a blank screen.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { buttonVariant, ui } from '@sudobility/design';
import i18n from '@/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** A lazy chunk failed to load (usually a stale hash after a deploy), by name or message. */
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Loading chunk')
  );
}

/**
 * Uses the i18n instance directly because a class component cannot call
 * useTranslation. "Try again" clears the error and re-renders the children.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
      >
        <h2 className={`${ui.text.h4} mb-2`}>
          {i18n.t('errorBoundary.title', 'Something went wrong')}
        </h2>
        <p className={`${ui.text.body} mb-6 max-w-md`}>
          {isChunkLoadError(error)
            ? i18n.t(
                'errorBoundary.chunkError',
                'A new version of the app may be available. Please try again.'
              )
            : i18n.t(
                'errorBoundary.genericError',
                'An unexpected error occurred. Please try again.'
              )}
        </p>
        <button
          type="button"
          onClick={() => this.setState({ error: null })}
          className={`px-4 py-2 ${buttonVariant('primary')} rounded-lg`}
        >
          {i18n.t('errorBoundary.tryAgain', 'Try again')}
        </button>
      </div>
    );
  }
}
