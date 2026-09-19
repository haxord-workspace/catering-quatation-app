import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="bottom-sheet-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-handle" />
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--divider)'
          }}
        >
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h4>
            {subtitle && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-ghost btn-icon"
            style={{ borderRadius: '50%', width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, maxHeight: 'calc(80vh - 120px)' }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--divider)',
              backgroundColor: 'var(--surface-secondary)'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
