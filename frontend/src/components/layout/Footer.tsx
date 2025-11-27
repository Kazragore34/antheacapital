import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black-soft dark:bg-gray-800 text-white mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-gold dark:text-gold-light">Anthea Capital</h3>
            <p className="text-gray-300 text-sm mb-4">
              Inmobiliaria premium en Aranjuez, Madrid
            </p>
            <p className="text-gray-400 text-xs">
              Calle Magnolias 32°A<br />
              28300, Aranjuez, Madrid
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/propiedades" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/empresa" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Empresa
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/politica-privacidad" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/aviso-legal" className="text-gray-300 dark:text-gray-400 hover:text-gold dark:hover:text-gold-light transition-colors">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
              <li>
                <a href="mailto:ana@antheacapital.es" className="hover:text-gold dark:hover:text-gold-light transition-colors">
                  ana@antheacapital.es
                </a>
              </li>
              <li>
                <a href="tel:+34656617465" className="hover:text-gold dark:hover:text-gold-light transition-colors">
                  +34 656 61 74 65
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/34656617465" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold dark:hover:text-gold-light transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Anthea Capital Consulting. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

