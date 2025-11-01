'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setToastMessage('');
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toastMessage} show={isVisible} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

