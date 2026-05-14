/**
 * ErrorBoundary — Catches render errors in its subtree and shows a Win98 fallback.
 *
 * Wrap risky areas (route bodies, 3D scenes, image galleries) so that a single
 * thrown error never blanks the whole app.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Subtree to protect. */
  children: ReactNode;
  /** Optional custom fallback. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Human-readable label used in the default fallback heading. */
  label?: string;
  /** Optional reporting hook (analytics, Sentry, etc.). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="error-boundary"
      >
        <div className="error-boundary__window">
          <div className="error-boundary__title-bar">
            <span>⚠ {this.props.label ?? 'Something went wrong'}</span>
          </div>
          <div className="error-boundary__body">
            <p>An unexpected error occurred while rendering this section.</p>
            <pre className="error-boundary__message">{error.message}</pre>
            <button
              type="button"
              className="win98-button"
              onClick={this.reset}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
