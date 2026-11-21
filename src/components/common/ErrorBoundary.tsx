import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0C0B] text-[#F8F5F0] flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-white/15 bg-[#171513] p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A461] mb-3">
              Mankamana Guest House
            </p>
            <h1 className="font-display text-3xl font-medium mb-3">
              Unable to Display This View
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              A runtime or permission error interrupted loading. Please refresh or return to the homepage.
            </p>
            <pre className="text-xs font-mono bg-black/50 border border-white/10 p-3 overflow-x-auto text-stone-400 mb-6">
              {this.state.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="px-5 py-2.5 bg-[#C9A461] text-[#0D0C0B] text-sm font-medium hover:bg-[#D7B575] transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
