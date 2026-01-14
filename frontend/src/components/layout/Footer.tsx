import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black-soft border-t border-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-gold">Anthea Capital</h3>
            <p className="text-gray-300 text-sm mb-4">
              Inmobiliaria premium en Aranjuez, Madrid
            </p>
            <p className="text-gray-400 text-xs">
              Calle Stuart 45<br />
              Aranjuez, Madrid 28300
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/propiedades" className="text-gray-300 hover:text-gold transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 hover:text-gold transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/empresa" className="text-gray-300 hover:text-gold transition-colors">
                  Empresa
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-gold transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/politica-privacidad" className="text-gray-300 hover:text-gold transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className="text-gray-300 hover:text-gold transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/aviso-legal" className="text-gray-300 hover:text-gold transition-colors">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:contacto@antheacapital.com" className="hover:text-gold transition-colors">
                  contacto@antheacapital.com
                </a>
              </li>
              <li>
                <a href="tel:+34656617465" className="hover:text-gold transition-colors">
                  +34 656 61 74 65
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/34656617465" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Anthea Capital Consulting. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

