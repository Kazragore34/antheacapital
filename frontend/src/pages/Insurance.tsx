import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Insurance = () => {
  const insuranceTypes = [
    {
      id: 'vida',
      title: 'Vida',
      description: 'Protege tu negocio ante pérdidas financieras derivadas de la muerte o incapacidad de personas clave.',
      icon: '💼',
    },
    {
      id: 'oficina-comercio',
      title: 'Oficina Comercio',
      description: 'Cobertura a los daños producidos en las propias instalaciones de la empresa.',
      icon: '🏢',
    },
    {
      id: 'baja-laboral',
      title: 'Baja Laboral',
      description: 'Protección a los autónomos en caso de baja debido a enfermedad o accidente.',
      icon: '🏥',
    },
    {
      id: 'rc-profesional',
      title: 'RC Profesional',
      description: 'Cobertura a la responsabilidad derivada de errores, omisiones o negligencias cometidas en el trabajo o servicio realizado.',
      icon: '⚖️',
    },
    {
      id: 'rc-general',
      title: 'RC General',
      description: 'Cobertura frente a demandas de terceros por daños personales y materiales.',
      icon: '🛡️',
    },
    {
      id: 'cyber',
      title: 'Cyber',
      description: 'Protege tu negocio frente a los riesgos digitales.',
      icon: '💻',
    },
    {
      id: 'asistencia-viaje',
      title: 'Asistencia en Viaje',
      description: 'Cobertura ante imprevistos durante el viaje (asistencia médica, pérdida del equipaje y cancelaciones, entre otras).',
      icon: '✈️',
    },
  ]

  return (
    <div className="min-h-screen bg-black-soft">
      {/* Hero Section */}
      <section className="bg-black-soft text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl mb-6"
          >
            Nuestros Seguros
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            Protección integral para tu negocio y tu futuro
          </motion.p>
        </div>
      </section>

      {/* Insurance Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((insurance, index) => (
              <motion.div
                key={insurance.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: index * 0.1,
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
                
                {/* Icono */}
                <motion.div
                  className="text-6xl mb-6 relative z-10"
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {insurance.icon}
                </motion.div>

                <h2 className="font-serif text-2xl mb-4 text-white relative z-10 group-hover:text-gold transition-colors">
                  {insurance.title}
                </h2>

                <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">
                  {insurance.description}
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={`/seguros/${insurance.id}`}
                    className="btn-primary inline-block relative z-10 w-full text-center"
                  >
                    Calcular Precio
                  </Link>
                </motion.div>

                {/* Línea decorativa dorada */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Insurance

