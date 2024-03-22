import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRoutes } from '../routes'

ReactDOM.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
)
