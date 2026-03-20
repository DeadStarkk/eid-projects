import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-overlay">
          <div className="error-boundary-panel">
            <AlertTriangle size={52} className="error-boundary-icon" />
            <h2 className="error-boundary-title">حدث خطأ غير متوقع 😔</h2>
            <p className="error-boundary-desc">
              عذرًا، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى
            </p>
            <div className="error-boundary-actions">
              <button className="btn btn-gold" onClick={this.handleReload}>
                <RefreshCw size={18} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                إعادة تحميل الصفحة
              </button>
              <button className="btn btn-ghost" onClick={this.handleGoHome}>
                العودة إلى الرئيسية 🏠
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>تفاصيل الخطأ (للمطور)</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
