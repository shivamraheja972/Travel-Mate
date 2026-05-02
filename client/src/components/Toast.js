import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const success = useCallback((msg) => show(msg, 'success'), [show]);
  const error = useCallback((msg) => show(msg, 'error'), [show]);
  const warning = useCallback((msg) => show(msg, 'warning'), [show]);
  const info = useCallback((msg) => show(msg, 'info'), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
