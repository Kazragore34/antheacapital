import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logoWhite from '../../assets/logo-white.svg'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/propiedades', label: 'Propiedades' },
    { path: '/servicios', label: 'Servicios' },
    { path: '/empresa', label: 'Empresa' },
    { path: '/contacto', label: 'Contacto' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logoWhite || '/logo-white.svg'} 
              alt="Anthea Capital" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50"><text x="10" y="30" font-family="serif" font-size="24" fill="%23D4AF37">ANTHEA CAPITAL</text></svg>'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-gold'
                    : 'text-black-soft hover:text-gold'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/valoracion"
              className="btn-primary text-sm"
            >
              Valorar Propiedad
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black-soft"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive(link.path)
                      ? 'text-gold'
                      : 'text-black-soft'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/valoracion"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-sm inline-block"
              >
                Valorar Propiedad
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header

