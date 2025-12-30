import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Services = () => {
  const services = [
    {
      title: 'Asesoramiento Integral',
      description: 'Servicio completo de gestión integral y asesoramiento personalizado adaptado a sus necesidades específicas.',
      icon: '💼',
      features: [
        'Gestión integral de su propiedad',
        'Asesoramiento personalizado',
        'Análisis de mercado',
        'Estrategia adaptada a sus necesidades',
        'Seguimiento continuo',
      ],
    },
    {
      title: 'Financiación',
      description: 'Le ayudamos a encontrar la mejor opción de financiación hipotecaria para su inversión inmobiliaria.',
      icon: '🏦',
      features: [
        'Comparativa de hipotecas',
        'Asesoramiento hipotecario',
        'Gestión de documentación',
        'Tramitación de escrituras',
        'Asesoramiento financiero',
      ],
    },
    {
      title: 'Seguros',
      description: 'Protección completa para su inversión con los mejores seguros del mercado.',
      icon: '🛡️',
      features: [
        'Seguros de hogar',
        'Seguros de vida',
        'Seguros de impago',
        'Asesoramiento personalizado',
        'Comparativa de ofertas',
      ],
    },
    {
      title: 'Alquiler Garantizado',
      description: 'Servicio de alquiler garantizado que le proporciona tranquilidad y seguridad en sus inversiones inmobiliarias.',
      icon: '🔑',
      features: [
        'Renta garantizada',
        'Gestión de inquilinos',
        'Mantenimiento incluido',
        'Seguro de impago',
        'Tranquilidad total',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black-soft to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl mb-6"
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            Soluciones integrales para todas sus necesidades inmobiliarias
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="card p-8 relative overflow-hidden group cursor-pointer"
              >
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:via-gold/10 group-hover:to-gold/5 transition-all duration-500"></div>
                
                {/* Icono con animación */}
                <motion.div 
                  className="text-6xl mb-6 relative z-10"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {service.icon}
                </motion.div>
                
                <h2 className="font-serif text-2xl mb-4 text-black-soft dark:text-white relative z-10 group-hover:text-gold transition-colors">
                  {service.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8 relative z-10">
                  {service.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center text-gray-700 dark:text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + idx * 0.1 }}
                    >
                      <motion.svg
                        className="w-5 h-5 text-gold mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/contacto" className="btn-secondary inline-block relative z-10">
                    Más Información
                  </Link>
                </motion.div>
                
                {/* Línea decorativa dorada */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gold via-gold-light to-gold-bright text-white rounded-2xl p-12 text-center shadow-2xl dark:from-gold-dark dark:via-gold dark:to-gold-light relative overflow-hidden"
          >
            {/* Efecto de brillo animado */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="font-serif text-3xl md:text-4xl mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                ¿Necesita más información?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Contacte con nosotros y le asesoraremos sobre el servicio que mejor se adapte a sus necesidades
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contacto" className="btn-secondary bg-white text-gold hover:bg-gray-100 inline-block">
                  Contactar Ahora
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

