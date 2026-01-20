import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

const About = () => {
  const { t } = useTranslation()
  
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
            {t('aboutPage.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            {t('aboutPage.subtitle')}
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
              {t('aboutPage.mission.title')}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {t('aboutPage.mission.text')}
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
              {t('aboutPage.vision.title')}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {t('aboutPage.vision.text')}
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
              {t('aboutPage.values.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: t('aboutPage.values.transparencia.title'),
                  description: t('aboutPage.values.transparencia.description'),
                  icon: '🔍',
                },
                {
                  title: t('aboutPage.values.profesionalidad.title'),
                  description: t('aboutPage.values.profesionalidad.description'),
                  icon: '💼',
                },
                {
                  title: t('aboutPage.values.compromiso.title'),
                  description: t('aboutPage.values.compromiso.description'),
                  icon: '🤝',
                },
                {
                  title: t('aboutPage.values.excelencia.title'),
                  description: t('aboutPage.values.excelencia.description'),
                  icon: '⭐',
                },
                {
                  title: t('aboutPage.values.innovacion.title'),
                  description: t('aboutPage.values.innovacion.description'),
                  icon: '🚀',
                },
                {
                  title: t('aboutPage.values.confianza.title'),
                  description: t('aboutPage.values.confianza.description'),
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
              {t('aboutPage.team.title')}
            </h2>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <div className="w-32 h-32 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-black-soft">
                  AM
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">{t('aboutPage.team.director')}</h3>
                <p className="text-gray-300 mb-4">{t('aboutPage.team.role')}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <a href="mailto:contacto@antheacapital.com" className="text-gold hover:underline">
                      contacto@antheacapital.com
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

