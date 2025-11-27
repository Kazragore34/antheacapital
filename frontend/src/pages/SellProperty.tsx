import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SellProperty = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gold via-gold-light to-gold-bright text-white py-20 shadow-lg dark:from-gold-dark dark:via-gold dark:to-gold-light">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl mb-6"
          >
            Venda su Propiedad con Anthea Capital
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Elaboramos todo lo de su propiedad teniendo en cuenta todos los detalles y características específicas
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center text-black-soft">
              ¿Por qué elegir Anthea Capital?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: 'Valoración Profesional',
                  description: 'Realizamos una valoración precisa de su propiedad basada en el mercado actual y las características específicas de su inmueble.',
                  icon: '📊',
                },
                {
                  title: 'Marketing Premium',
                  description: 'Utilizamos las mejores estrategias de marketing para dar máxima visibilidad a su propiedad.',
                  icon: '📸',
                },
                {
                  title: 'Asesoramiento Integral',
                  description: 'Le acompañamos en todo el proceso, desde la valoración hasta la firma de la escritura.',
                  icon: '💼',
                },
                {
                  title: 'Gestión Completa',
                  description: 'Nos encargamos de toda la documentación, trámites y negociaciones necesarias.',
                  icon: '📋',
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-serif text-xl mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h3 className="font-serif text-2xl mb-4 text-black-soft">
                Proceso de Venta
              </h3>
              <ol className="space-y-4">
                {[
                  'Contacte con nosotros y solicite una valoración gratuita',
                  'Realizamos una visita a su propiedad para evaluarla en detalle',
                  'Le presentamos un informe completo con la valoración y estrategia de venta',
                  'Firmamos el contrato de exclusiva o no exclusiva',
                  'Comenzamos el marketing y promoción de su propiedad',
                  'Gestionamos las visitas y negociaciones con compradores interesados',
                  'Le acompañamos hasta la firma de la escritura',
                ].map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-center space-y-6">
              <div>
                <h3 className="font-serif text-2xl mb-4 text-black-soft">
                  ¿Listo para vender su propiedad?
                </h3>
                <p className="text-gray-600 mb-6">
                  Solicite una valoración gratuita y sin compromiso. Nuestro equipo se pondrá en contacto con usted.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/valoracion" className="btn-primary">
                  Solicitar Valoración Gratuita
                </Link>
                <Link to="/contacto" className="btn-secondary">
                  Contactar con Nosotros
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SellProperty

