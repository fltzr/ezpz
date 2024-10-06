import '@/i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import '@cloudscape-design/global-styles/index.css';
import './styles/index.scss';

const root = document.querySelector('#app');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
