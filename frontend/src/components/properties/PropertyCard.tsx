import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Property } from '../../types'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden group"
    >
      <Link to={`/propiedades/${property._id}`}>
        <div className="relative h-64 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.type === 'venta' 
                ? 'bg-gold text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {property.type === 'venta' ? 'Venta' : 'Alquiler'}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-black bg-opacity-70 text-white text-sm font-semibold">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl mb-2 text-white group-hover:text-gold transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.features.bedrooms}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {property.features.bathrooms}
              </span>
              <span>{property.features.area} m²</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            {property.location.city}, {property.location.province}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard

