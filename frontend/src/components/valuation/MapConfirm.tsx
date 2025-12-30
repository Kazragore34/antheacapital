import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface MapConfirmProps {
  address: string
  coordinates?: [number, number]
  onConfirm: () => void
  onCorrect: () => void
}

const MapConfirm = ({ address, coordinates, onConfirm, onCorrect }: MapConfirmProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const defaultCenter: google.maps.LatLngLiteral = coordinates 
      ? { lat: coordinates[0], lng: coordinates[1] }
      : { lat: 40.0311, lng: -3.6025 } // Aranjuez por defecto

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: coordinates ? 17 : 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    mapInstanceRef.current = map

    if (coordinates) {
      const marker = new window.google.maps.Marker({
        position: defaultCenter,
        map: map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })

      markerRef.current = marker

      marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          }
          map.setCenter(newPosition)
        }
      })
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [coordinates])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">
          Confirmar la dirección del inmueble
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          {address}
        </p>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg overflow-hidden border border-gray-700"
        style={{ minHeight: '256px' }}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="btn-primary flex-1"
        >
          Confirmar dirección
        </button>
        <button
          type="button"
          onClick={onCorrect}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Corregir posición
        </button>
      </div>
    </motion.div>
  )
}

export default MapConfirm

