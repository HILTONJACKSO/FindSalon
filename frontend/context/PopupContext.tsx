'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type PopupType = 'SUCCESS' | 'ERROR' | 'INFO' | 'CONFIRM';

interface PopupOptions {
  title: string;
  message: string;
  type?: PopupType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface PopupContextType {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

// --- Provider Component ---
export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions | null>(null);

  const showPopup = useCallback((opts: PopupOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const hidePopup = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setOptions(null), 300); // Clear after animation
  }, []);

  const handleConfirm = () => {
    if (options?.onConfirm) options.onConfirm();
    hidePopup();
  };

  const handleCancel = () => {
    if (options?.onCancel) options.onCancel();
    hidePopup();
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      
      <AnimatePresence>
        {isOpen && options && (
          <div className="popup-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="popup-container"
            >
              <button className="popup-close" onClick={hidePopup}>
                <FiX size={20} />
              </button>

              <div className="popup-content">
                <div className={`popup-icon-wrapper ${options.type?.toLowerCase() || 'info'}`}>
                  {options.type === 'SUCCESS' && <FiCheckCircle size={32} />}
                  {options.type === 'ERROR' && <FiAlertCircle size={32} />}
                  {options.type === 'CONFIRM' && <FiAlertTriangle size={32} />}
                  {(options.type === 'INFO' || !options.type) && <FiInfo size={32} />}
                </div>

                <h3 className="popup-title">{options.title}</h3>
                <p className="popup-message">{options.message}</p>

                <div className="popup-actions">
                  {options.type === 'CONFIRM' ? (
                    <>
                      <button className="btn-cancel" onClick={handleCancel}>
                        {options.cancelLabel || 'Cancel'}
                      </button>
                      <button className="btn-confirm" onClick={handleConfirm}>
                        {options.confirmLabel || 'Proceed'}
                      </button>
                    </>
                  ) : (
                    <button className="btn-primary" onClick={hidePopup}>
                      Great, thanks
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <style jsx>{`
              .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(18, 15, 13, 0.85);
                backdrop-filter: blur(12px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              .popup-container {
                background: #FFFFFF;
                width: 100%;
                max-width: 440px;
                border-radius: 40px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.1);
              }
              .popup-close {
                position: absolute;
                top: 24px;
                right: 24px;
                background: none;
                border: none;
                color: #A0A0A0;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
              }
              .popup-close:hover {
                color: #1A1A1A;
                transform: rotate(90deg);
              }
              .popup-content {
                padding: 50px 40px 40px;
                text-align: center;
              }
              .popup-icon-wrapper {
                width: 80px;
                height: 80px;
                border-radius: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 30px;
              }
              .popup-icon-wrapper.success { background: #E8F5E9; color: #2E7D32; }
              .popup-icon-wrapper.error { background: #FFEBEE; color: #C62828; }
              .popup-icon-wrapper.confirm { background: #FFF3E0; color: #EF6C00; }
              .popup-icon-wrapper.info { background: #E3F2FD; color: #1565C0; }

              .popup-title {
                font-size: 1.75rem;
                font-weight: 800;
                color: #1A1A1A;
                margin-bottom: 12px;
                letter-spacing: -1px;
              }
              .popup-message {
                font-size: 1rem;
                color: #666666;
                line-height: 1.6;
                margin-bottom: 40px;
              }
              .popup-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
              }
              button {
                padding: 16px 32px;
                border-radius: 100px;
                font-weight: 700;
                font-size: 0.9rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                border: none;
              }
              .btn-primary {
                background: #1A1A1A;
                color: #FFFFFF;
                width: 100%;
              }
              .btn-primary:hover {
                background: #333333;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
              }
              .btn-confirm {
                background: #9C4A34;
                color: #FFFFFF;
                flex: 1;
              }
              .btn-confirm:hover {
                background: #B05540;
                transform: translateY(-2px);
              }
              .btn-cancel {
                background: #F5F5F5;
                color: #666666;
                flex: 1;
              }
              .btn-cancel:hover {
                background: #EEEEEE;
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </PopupContext.Provider>
  );
}

// --- Hook ---
export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}
