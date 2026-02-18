import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router'


// Initialize Sync Service
// Initialize Sync Service
// syncService.init(); // Handled by DataSyncWrapper

// Register Service Worker if supported (VitePWA auto-update handles this mostly, but good to be explicit or leave to plugin)
// The plugin 'vite-plugin-pwa'/client handles registration usually.


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
