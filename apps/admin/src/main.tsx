import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // ¡ESTA LÍNEA ES LA QUE CARGA TODO EL DISEÑO!
import { AuthProvider } from './context/AuthContext.tsx'

// Si el CSS no se carga, verás solo texto. Esta es la raíz del problema.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
