import React, { Component } from "react";
import { Button } from "../components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-md p-4">
                <h2 className="font-semibold text-red-800">
                  {this.state.error?.name || "Error"}
                </h2>
                <p className="text-red-600 mt-1">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
              </div>

              {this.state.errorInfo && (
                <div className="bg-gray-50 rounded-md p-4 overflow-auto">
                  <h3 className="font-semibold text-gray-700 mb-2">Stack Trace:</h3>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button variant="outline" onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export  {ErrorBoundary};
