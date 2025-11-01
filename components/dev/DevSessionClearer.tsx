'use client';

import { useEffect } from 'react';

export default function DevSessionClearer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const sessionKey = 'dev_session_initialized';
      const isInitialized = sessionStorage.getItem(sessionKey);
      
      if (!isInitialized) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, []);

  return null;
}

