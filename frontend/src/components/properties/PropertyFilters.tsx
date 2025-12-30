import { useState } from 'react'

interface PropertyFiltersProps {
  onFilterChange: (filters: {
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
  }) => void
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    minArea: '',
  })

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    onFilterChange({
      type: newFilters.type || undefined,
      city: newFilters.city || undefined,
      minPrice: newFilters.minPrice ? parseInt(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? parseInt(newFilters.maxPrice) : undefined,
      bedrooms: newFilters.bedrooms ? parseInt(newFilters.bedrooms) : undefined,
      minArea: newFilters.minArea ? parseInt(newFilters.minArea) : undefined,
    })
  }

  const clearFilters = () => {
    const emptyFilters = {
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      minArea: '',
    }
    setFilters(emptyFilters)
    onFilterChange({})
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ciudad
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Ej: Aranjuez"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio Mín.
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            placeholder="€"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio Máx.
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            placeholder="€"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Habitaciones
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            className="input-field"
          >
            <option value="">Todas</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Superficie Mín.
          </label>
          <input
            type="number"
            value={filters.minArea}
            onChange={(e) => handleChange('minArea', e.target.value)}
            placeholder="m²"
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="text-sm text-gray-300 hover:text-gold transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}

export default PropertyFilters

