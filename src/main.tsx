import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import { clerkEnabled, clerkPublishableKey } from './services/auth.ts'
import { BRAND } from './config/brand.ts'
import './index.css'

document.title = BRAND.browserTitle

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {clerkEnabled ? (
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
