import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'
import inicioImage from '../assets/inicio.jpg'

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
      <section className="relative h-[90vh] flex items-center justify-center bg-black-soft text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${inicioImage})`,
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
      <section className="py-20 bg-black-soft">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">
              Propiedades Destacadas
            </h2>
            <p className="text-gray-300 text-lg">
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
              <p className="text-gray-400">No hay propiedades disponibles en este momento.</p>
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
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">
              Nuestros Servicios
            </h2>
            <p className="text-gray-300 text-lg">
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

      {/* Insurance Preview */}
      <section className="py-20 bg-black-soft">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">
              Nuestros Mejores Seguros
            </h2>
            <p className="text-gray-300 text-lg">
              Protección integral para profesionales, pymes y empresas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { id: 'vida', title: 'Vida', icon: '💼', description: 'Protege tu negocio ante pérdidas financieras' },
              { id: 'oficina-comercio', title: 'Oficina Comercio', icon: '🏢', description: 'Cobertura para instalaciones de la empresa' },
              { id: 'baja-laboral', title: 'Baja Laboral', icon: '🏥', description: 'Protección para autónomos' },
              { id: 'rc-profesional', title: 'RC Profesional', icon: '⚖️', description: 'Cobertura de responsabilidad profesional' },
            ].map((insurance, index) => (
              <motion.div
                key={insurance.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 text-center hover:border-gold transition-all group"
              >
                <div className="text-4xl mb-4">{insurance.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-gold transition-colors">
                  {insurance.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{insurance.description}</p>
                <Link
                  to={`/seguros/${insurance.id}`}
                  className="btn-primary text-sm inline-block"
                >
                  Calcular Precio
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/seguros" className="btn-secondary">
              Ver Todos los Seguros
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gold-dark via-gold to-gold-light text-black-soft">
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
          <Link to="/contacto" className="btn-secondary bg-black-soft text-gold hover:bg-gray-900 border-black-soft">
            Contactar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

