import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
// import { WindowStoreProvider } from './store'
import { AppRoutes } from '../routes'

ReactDOM.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    {/* <WindowStoreProvider> */}
      <AppRoutes />
    {/* </WindowStoreProvider> */}
  </React.StrictMode>
)
