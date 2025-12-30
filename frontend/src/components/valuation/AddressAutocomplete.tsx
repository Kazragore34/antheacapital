import { useRef, useEffect } from 'react'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  placeholder?: string
  disabled?: boolean
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onPlaceSelect,
  placeholder = "Escribe una dirección...",
  disabled = false
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!inputRef.current || disabled) return

    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'es' },
        fields: ['address_components', 'geometry', 'formatted_address'],
        types: ['address']
      })

      autocompleteRef.current = autocomplete

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.formatted_address) {
          onChange(place.formatted_address)
          if (onPlaceSelect) {
            onPlaceSelect(place)
          }
        }
      })
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange, onPlaceSelect, disabled])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="input-field"
    />
  )
}

export default AddressAutocomplete

