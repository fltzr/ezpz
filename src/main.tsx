import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';

import '@cloudscape-design/global-styles/index.css';
import './index.css';

const root = document.querySelector('#app');

root &&
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
