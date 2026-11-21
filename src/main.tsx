import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Google Maps Platform quota / auth failure surface
declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

const dispatchQuotaExceeded = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

window.gm_authFailure = dispatchQuotaExceeded;

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const joined = args.map((a) => String(a)).join(' ');
  if (joined.includes('OverQuotaMapError') || joined.includes('QuotaExceededError')) {
    dispatchQuotaExceeded();
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
