import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Services = () => {
  const services = [
    {
      title: 'Gestoría y Financiación',
      description: 'Gestionamos todos los trámites necesarios para la compra, venta o alquiler de su propiedad. Asesoramiento en financiación hipotecaria y gestión de documentación.',
      icon: '📋',
      features: [
        'Gestión de documentación',
        'Asesoramiento hipotecario',
        'Tramitación de escrituras',
        'Gestión de impuestos',
      ],
    },
    {
      title: 'Asesoramiento Integral',
      description: 'Ofrecemos un servicio completo de asesoramiento inmobiliario adaptado a sus necesidades específicas.',
      icon: '💼',
      features: [
        'Análisis de mercado',
        'Estrategia personalizada',
        'Asesoramiento legal',
        'Seguimiento continuo',
      ],
    },
    {
      title: 'Financiamiento y Seguros',
      description: 'Le ayudamos a encontrar la mejor opción de financiación y seguros para proteger su inversión.',
      icon: '🏦',
      features: [
        'Comparativa de hipotecas',
        'Seguros de hogar',
        'Seguros de vida',
        'Asesoramiento financiero',
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 hover:border-gold transition-all"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h2 className="font-serif text-2xl mb-4 text-black-soft">
                  {service.title}
                </h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-gold mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contacto" className="btn-secondary inline-block">
                  Más Información
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gold text-white rounded-lg p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              ¿Necesita más información?
            </h2>
            <p className="text-xl mb-8">
              Contacte con nosotros y le asesoraremos sobre el servicio que mejor se adapte a sus necesidades
            </p>
            <Link to="/contacto" className="btn-secondary bg-white text-gold hover:bg-gray-100">
              Contactar Ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services

