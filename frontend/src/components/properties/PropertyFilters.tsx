import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'

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
  const { t } = useTranslation()
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
          <label htmlFor="filter-type" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.type')}
          </label>
          <select
            id="filter-type"
            name="type"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="input-field"
          >
            <option value="">{t('properties.filters.all')}</option>
            <option value="propiedades">{t('properties.filters.properties')}</option>
            <option value="habitaciones">{t('properties.filters.rooms')}</option>
            <option value="traspasos">{t('properties.filters.transfers')}</option>
            <option value="venta">{t('properties.filters.sale')}</option>
            <option value="alquiler">{t('properties.filters.rent')}</option>
            <option value="alquiler-opcion-compra">{t('properties.filters.rentOption')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-city" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.city')}
          </label>
          <input
            id="filter-city"
            name="city"
            type="text"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder={t('properties.filters.cityPlaceholder')}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="filter-min-price" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.minPrice')}
          </label>
          <input
            id="filter-min-price"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            placeholder="€"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="filter-max-price" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.maxPrice')}
          </label>
          <input
            id="filter-max-price"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            placeholder="€"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="filter-bedrooms" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.bedrooms')}
          </label>
          <select
            id="filter-bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            className="input-field"
          >
            <option value="">{t('properties.filters.allBedrooms')}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-min-area" className="block text-sm font-medium text-gray-300 mb-2">
            {t('properties.filters.minArea')}
          </label>
          <input
            id="filter-min-area"
            name="minArea"
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
          {t('properties.filters.clear')}
        </button>
      </div>
    </div>
  )
}

export default PropertyFilters

