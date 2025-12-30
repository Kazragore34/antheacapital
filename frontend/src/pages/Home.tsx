import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'
import inicioImage from '../assets/inicio.jpg'

// Propiedades de ejemplo para mostrar cuando no hay datos
const exampleProperties: Property[] = [
    {
      _id: 'example-1',
      title: 'Piso en el Centro de Aranjuez',
      description: 'Hermoso piso de 3 habitaciones en el corazón de Aranjuez, completamente reformado y con excelentes vistas.',
      type: 'venta',
      price: 185000,
      location: {
        address: 'Calle Real 25',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 95,
        floor: 2,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-2',
      title: 'Casa con Jardín en Zona Residencial',
      description: 'Encantadora casa independiente con jardín privado, ideal para familias. Zona tranquila y bien comunicada.',
      type: 'venta',
      price: 320000,
      location: {
        address: 'Avenida de la Paz 42',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        parking: true,
        elevator: false,
      },
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-3',
      title: 'Ático con Terraza Panorámica',
      description: 'Lujoso ático con terraza privada y vistas espectaculares. Acabados de alta calidad y diseño moderno.',
      type: 'venta',
      price: 275000,
      location: {
        address: 'Calle de la Reina 8',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 110,
        floor: 5,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-4',
      title: 'Piso en Alquiler - Centro Histórico',
      description: 'Acogedor piso de 2 habitaciones en el casco histórico, perfecto para parejas o profesionales.',
      type: 'alquiler',
      price: 850,
      location: {
        address: 'Plaza de San Antonio 12',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        floor: 1,
        parking: false,
        elevator: false,
      },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-5',
      title: 'Dúplex Moderno con Garaje',
      description: 'Espacioso dúplex de diseño contemporáneo, con garaje incluido y zona común. Ideal para familias jóvenes.',
      type: 'venta',
      price: 245000,
      location: {
        address: 'Calle de la Primavera 15',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 130,
        floor: 1,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-6',
      title: 'Estudio Reformado - Zona Centro',
      description: 'Estudio completamente reformado, perfecto para estudiantes o profesionales. Muy bien ubicado.',
      type: 'alquiler',
      price: 550,
      location: {
        address: 'Calle de la Estación 7',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        floor: 3,
        parking: false,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
]

const Home = () => {
  // Inicializar con propiedades de ejemplo para que siempre se muestren
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>(exampleProperties)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await propertiesService.getAll()
        // Si hay propiedades del backend, usar las primeras 6
        if (Array.isArray(properties) && properties.length > 0) {
          setFeaturedProperties(properties.slice(0, 6))
        } else {
          // Si no hay propiedades, mantener las de ejemplo
          setFeaturedProperties(exampleProperties)
        }
      } catch (error) {
        console.error('Error loading properties:', error)
        // En caso de error, mantener propiedades de ejemplo
        setFeaturedProperties(exampleProperties)
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
              Encuentra tu hogar perfecto
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              style={{ 
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' 
              }}
            >
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
          <Link to="/contacto" className="btn-secondary bg-black-soft text-gold hover:bg-gray-800 border-black-soft">
            Contactar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

