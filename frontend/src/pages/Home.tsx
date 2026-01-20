import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'
import inicioImage from '../assets/inicio.jpg'
import { useTranslation } from '../hooks/useTranslation'

const Home = () => {
  const { t } = useTranslation()
  // Las propiedades ahora vienen del XML de Inmovilla
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Usar la API para obtener propiedades destacadas
        const { inmovillaAPIService } = await import('../services/inmovilla-api.service')
        const featured = await inmovillaAPIService.getFeatured(6)
        
        if (Array.isArray(featured) && featured.length > 0) {
          setFeaturedProperties(featured)
        } else {
          // Si no hay destacados, intentar obtener las primeras 6 propiedades normales
          const properties = await propertiesService.getAll()
          if (Array.isArray(properties) && properties.length > 0) {
            setFeaturedProperties(properties.slice(0, 6))
          } else {
            setFeaturedProperties([])
          }
        }
      } catch (error) {
        console.error('Error loading featured properties:', error)
        // En caso de error, mostrar array vacío
        setFeaturedProperties([])
      }
    }
    loadProperties()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-black-soft text-white">
        {/* Overlay más oscuro y uniforme */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/70"></div>
        
        {/* Imagen de fondo con opacidad reducida */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: `url(${inicioImage})`,
          }}
        ></div>
        
        {/* Contenedor de texto con fondo semi-transparente */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-gold/20">
            <h1 
              className="font-serif text-5xl md:text-7xl mb-6"
              style={{ 
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' 
              }}
            >
              {t('home.hero.title')}
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              style={{ 
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' 
              }}
            >
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/propiedades" className="btn-primary text-lg px-8 py-4">
                {t('home.hero.cta')}
              </Link>
              <Link to="/valoracion" className="btn-secondary text-lg px-8 py-4">
                {t('home.hero.ctaValuation')}
              </Link>
            </div>
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
              {t('home.featured.title')}
            </h2>
            <p className="text-gray-300 text-lg">
              {t('home.featured.subtitle')}
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
              <p className="text-gray-400">{t('home.featured.noProperties')}</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/propiedades" className="btn-secondary">
              {t('home.featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">
              {t('home.services.title')}
            </h2>
            <p className="text-gray-300 text-lg">
              {t('home.services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('home.services.items.gestoria'), icon: '📋' },
              { title: t('home.services.items.asesoramiento'), icon: '💼' },
              { title: t('home.services.items.financiamiento'), icon: '🏦' },
              { title: t('home.services.items.alquiler'), icon: '🔑' },
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
              {t('home.services.knowMore')}
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
              {t('home.insurance.title')}
            </h2>
            <p className="text-gray-300 text-lg">
              {t('home.insurance.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { id: 'vida', title: t('home.insurance.items.vida.title'), icon: '💼', description: t('home.insurance.items.vida.description') },
              { id: 'oficina-comercio', title: t('home.insurance.items.oficina.title'), icon: '🏢', description: t('home.insurance.items.oficina.description') },
              { id: 'baja-laboral', title: t('home.insurance.items.baja.title'), icon: '🏥', description: t('home.insurance.items.baja.description') },
              { id: 'rc-profesional', title: t('home.insurance.items.rc.title'), icon: '⚖️', description: t('home.insurance.items.rc.description') },
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
                  {t('home.insurance.calculate')}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/seguros" className="btn-secondary">
              {t('home.insurance.viewAll')}
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
            {t('home.cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            {t('home.cta.subtitle')}
          </motion.p>
          <Link to="/contacto" className="btn-secondary bg-black-soft text-gold hover:bg-gray-800 border-black-soft">
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

