import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center">
          <div className="max-w-md p-10 bg-slate-900 rounded-[3rem] border border-red-500/30">
            <h1 className="text-4xl font-black text-white mb-4 uppercase italic">UI Crash <span className="text-red-500">Detected</span></h1>
            <p className="text-slate-400 mb-8 font-medium">A component failed to render. We've captured the error for debugging.</p>
            <pre className="text-[10px] bg-black/50 p-4 rounded-xl text-red-400 overflow-x-auto mb-8 text-left">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
