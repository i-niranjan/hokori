// components/ErrorBoundary.tsx
import React, { type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log the error to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default enhanced error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-red-100">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, this happens
              sometimes. You can try refreshing the page or going back to
              continue using the app.
            </p>

            {/* Error Details (if enabled) */}
            {this.props.showDetails && this.state.error && (
              <div className="mb-8">
                <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Error Message:
                      </h4>
                      <code className="block bg-red-50 text-red-800 p-3 rounded border text-sm overflow-auto">
                        {this.state.error.message}
                      </code>
                    </div>

                    {this.state.error.stack && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Stack Trace:
                        </h4>
                        <code className="block bg-gray-100 text-gray-700 p-3 rounded border text-xs overflow-auto max-h-40">
                          {this.state.error.stack}
                        </code>
                      </div>
                    )}

                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Component Stack:
                        </h4>
                        <code className="block bg-blue-50 text-blue-800 p-3 rounded border text-xs overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </code>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reload Page
              </button>

              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Back
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                If this problem persists, please contact support or try again
                later.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
