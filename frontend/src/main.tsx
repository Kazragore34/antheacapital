import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './styles/global.css'

// Handler global para errores no capturados
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error)
  // El ErrorBoundary capturará errores de React
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada no manejada:', event.reason)
  // Prevenir que el error se muestre en la consola del navegador
  event.preventDefault()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

