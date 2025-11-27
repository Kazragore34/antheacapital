import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await propertiesService.getAll()
        // Asegurar que properties es un array antes de hacer slice
        if (Array.isArray(properties)) {
          setFeaturedProperties(properties.slice(0, 6))
        } else {
          setFeaturedProperties([])
        }
      } catch (error) {
        console.error('Error loading properties:', error)
        setFeaturedProperties([])
      }
    }
    loadProperties()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-black-soft via-gray-900 to-black-soft text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)',
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Encuentra tu hogar perfecto
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Propiedades premium en Aranjuez y Madrid
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/propiedades" className="btn-primary text-lg px-8 py-4">
              Ver Propiedades
            </Link>
            <Link to="/valoracion" className="btn-secondary text-lg px-8 py-4">
              Valorar Propiedad
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-black-soft">
              Propiedades Destacadas
            </h2>
            <p className="text-gray-600 text-lg">
              Selección de las mejores propiedades disponibles
            </p>
          </motion.div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay propiedades disponibles en este momento.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/propiedades" className="btn-secondary">
              Ver Todas las Propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-black-soft">
              Nuestros Servicios
            </h2>
            <p className="text-gray-600 text-lg">
              Soluciones integrales para todas tus necesidades inmobiliarias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Gestoría y Financiación', icon: '📋' },
              { title: 'Asesoramiento Integral', icon: '💼' },
              { title: 'Financiamiento y Seguros', icon: '🏦' },
              { title: 'Alquiler Garantizado', icon: '🔑' },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center hover:border-gold transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/servicios" className="btn-primary">
              Conocer Más Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl mb-6"
          >
            ¿Listo para encontrar tu hogar ideal?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            Contacta con nosotros y te ayudaremos a encontrar la propiedad perfecta
          </motion.p>
          <Link to="/contacto" className="btn-secondary bg-white text-gold hover:bg-gray-100">
            Contactar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

