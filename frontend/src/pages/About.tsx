import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="min-h-screen bg-black-soft">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black-soft to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl mb-6"
          >
            Sobre Anthea Capital
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            Inmobiliaria premium en Aranjuez, Madrid
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black-soft">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">
              Nuestra Misión
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              En Anthea Capital Consulting, nos dedicamos a ofrecer un servicio inmobiliario de excelencia, 
              proporcionando asesoramiento integral y personalizado a nuestros clientes. Nuestra misión es 
              ayudarle a encontrar la propiedad perfecta o a vender su inmueble con el máximo valor, siempre 
              con transparencia, profesionalidad y atención al detalle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">
              Nuestra Visión
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Aspiramos a ser la inmobiliaria de referencia en Aranjuez y la Comunidad de Madrid, reconocida 
              por nuestro compromiso con la calidad, la innovación y la satisfacción del cliente. Queremos 
              ser el socio de confianza para todas sus necesidades inmobiliarias, desde la compra y venta 
              hasta el alquiler y la gestión de propiedades.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-8 text-center text-white">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Transparencia',
                  description: 'Actuamos con honestidad y claridad en todas nuestras operaciones, manteniendo a nuestros clientes informados en todo momento.',
                  icon: '🔍',
                },
                {
                  title: 'Profesionalidad',
                  description: 'Contamos con un equipo altamente cualificado y experiencia en el sector inmobiliario para ofrecer el mejor servicio.',
                  icon: '💼',
                },
                {
                  title: 'Compromiso',
                  description: 'Nos comprometemos con cada cliente para alcanzar sus objetivos, dedicando el tiempo y esfuerzo necesarios.',
                  icon: '🤝',
                },
                {
                  title: 'Excelencia',
                  description: 'Buscamos la excelencia en cada detalle, desde la valoración hasta la firma de la escritura.',
                  icon: '⭐',
                },
                {
                  title: 'Innovación',
                  description: 'Utilizamos las últimas tecnologías y estrategias de marketing para dar máxima visibilidad a las propiedades.',
                  icon: '🚀',
                },
                {
                  title: 'Confianza',
                  description: 'Construimos relaciones duraderas basadas en la confianza mutua y el respeto.',
                  icon: '💎',
                },
              ].map((value, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-serif text-xl mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center"
          >
            <h2 className="font-serif text-3xl mb-6 text-white">
              Nuestro Equipo
            </h2>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <div className="w-32 h-32 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-black-soft">
                  AM
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">Ana María Sánchez Trillo</h3>
                <p className="text-gray-300 mb-4">Directora y Asesora Inmobiliaria</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <a href="mailto:ana@antheacapital.es" className="text-gold hover:underline">
                      ana@antheacapital.es
                    </a>
                  </p>
                  <p>
                    <a href="tel:+34656617465" className="text-gold hover:underline">
                      +34 656 61 74 65
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

