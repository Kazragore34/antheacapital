import { useState, useEffect } from 'react'

interface ErrorDisplayProps {
  error: Error | null
  onDismiss: () => void
}

const ErrorDisplay = ({ error, onDismiss }: ErrorDisplayProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      // Auto-dismiss después de 10 segundos
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss()
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [error, onDismiss])

  if (!error || !isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md animate-slide-in">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-lg rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Error en la aplicación
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message || 'Ha ocurrido un error inesperado'}</p>
              {import.meta.env.DEV && error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs">Detalles técnicos</summary>
                  <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsVisible(false)
                  onDismiss()
                }}
                className="text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="ml-4 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Recargar página
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onDismiss()
            }}
            className="ml-4 flex-shrink-0 text-red-400 hover:text-red-500"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay

