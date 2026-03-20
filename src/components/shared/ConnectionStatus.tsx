import React from 'react';
import { WifiOff, Loader } from 'lucide-react';

function ConnectionStatus({ status, onRetry }) {
  if (status === 'connected') return null;

  return (
    <div className="connection-overlay">
      <div className="connection-panel">
        {status === 'connecting' && (
          <>
            <Loader size={40} className="connection-spinner" />
            <h2 className="connection-title">جاري الاتصال...</h2>
            <p className="connection-desc">يتم الاتصال بالخادم، يرجى الانتظار</p>
          </>
        )}
        {status === 'disconnected' && (
          <>
            <WifiOff size={48} className="connection-icon-error" />
            <h2 className="connection-title">انقطع الاتصال</h2>
            <p className="connection-desc">تم فقدان الاتصال بالخادم</p>
            <button className="btn btn-gold connection-retry-btn" onClick={onRetry}>
              إعادة الاتصال 🔄
            </button>
          </>
        )}
        {status === 'failed' && (
          <>
            <WifiOff size={48} className="connection-icon-error" />
            <h2 className="connection-title">فشل الاتصال</h2>
            <p className="connection-desc">تعذّر الاتصال بالخادم. تأكد من تشغيل الخادم وحاول مرة أخرى</p>
            <button className="btn btn-gold connection-retry-btn" onClick={onRetry}>
              إعادة المحاولة 🔄
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ConnectionStatus;
