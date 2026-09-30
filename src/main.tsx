/**
 * @fileoverview Entry point. Services must exist before any component
 * renders, so App is imported only after initializeApp() resolves; the
 * dynamic import also keeps App out of the entry chunk.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initializeApp } from './config/initialize';

initializeApp().then(async () => {
  const { default: App } = await import('./App');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
