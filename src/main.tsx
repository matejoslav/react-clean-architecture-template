import 'reflect-metadata';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerDependencies } from './di';
import App from './App';

registerDependencies();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
