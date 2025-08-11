import React, { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Đã xảy ra lỗi
            </h1>
            
            <p className="text-gray-600 mb-6">
              Xin lỗi, đã có lỗi xảy ra trong ứng dụng. Vui lòng thử lại hoặc liên hệ với ban quản lý.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded p-3 mb-4 text-left">
                <p className="text-sm font-mono text-red-600">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Thử lại
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Error fallback component for smaller sections
export const ErrorFallback = ({ error, onRetry, message = 'Đã xảy ra lỗi khi tải dữ liệu' }) => {
  return (
    <div className="bg-white rounded-lg border border-red-200 p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {message}
      </h3>
      
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center mx-auto"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Thử lại
        </button>
      )}
    </div>
  );
};

