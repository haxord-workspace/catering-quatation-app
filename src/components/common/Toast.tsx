import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container no-print">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'text-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--success)';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          iconColor = 'var(--warning)';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          iconColor = 'var(--danger)';
        } else {
          Icon = Info;
          iconColor = 'var(--primary)';
        }

        return (
          <div key={toast.id} className="toast">
            <div style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }}>
              <Icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              {toast.message && (
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
