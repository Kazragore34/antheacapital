import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logoIcon from '../../assets/logo-icon.svg'
import logoText from '../../assets/logo-text.svg'
import LanguageSelector from './LanguageSelector'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [justAppeared, setJustAppeared] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Cambiar sombra y backdrop cuando se hace scroll (umbral más bajo para que se active antes)
      setIsScrolled(currentScrollY > 5)
      
      // Ocultar header al bajar, mostrar al subir
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setJustAppeared(false)
      } else {
        const wasHidden = !isVisible
        setIsVisible(true)
        if (wasHidden) {
          setJustAppeared(true)
          // Resetear el flag después de la animación
          setTimeout(() => setJustAppeared(false), 600)
        }
      }
      
      setLastScrollY(currentScrollY)
    }

    // Ejecutar una vez al montar para establecer el estado inicial
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/propiedades', label: 'Propiedades' },
    { path: '/servicios', label: 'Servicios' },
    { path: '/empresa', label: 'Empresa' },
    { path: '/contacto', label: 'Contacto' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] // Cubic bezier para transición suave
      }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-black-soft/95 backdrop-blur-md shadow-xl border-gray-800/50' 
          : 'bg-black-soft/90 backdrop-blur-sm shadow-lg border-gray-800'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  key="logo-container"
                  className="flex-shrink-0"
                  initial={justAppeared ? {
                    opacity: 0,
                    scale: 0.7,
                    y: -15,
                    rotate: -10
                  } : false}
                  animate={{ 
                    opacity: 1,
                    scale: isScrolled ? 0.85 : 1,
                    y: 0,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: -10
                  }}
                  transition={justAppeared ? {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1], // Ease out back para efecto bounce suave
                  } : {
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <motion.img 
                    src={logoIcon} 
                    alt="Anthea Capital" 
                    className="h-12 w-auto"
                    whileHover={{ scale: 1.05 }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {!isScrolled && (
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, width: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    width: 'auto', 
                    x: 0 
                  }}
                  exit={{ 
                    opacity: 0, 
                    width: 0, 
                    x: -10 
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="overflow-hidden ml-3"
                >
                  <img
                    src={logoText}
                    alt="Anthea Capital"
                    className="h-4 w-auto"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <Link
                  to={link.path}
                  className={`relative font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-gold'
                      : 'text-white hover:text-gold'
                  }`}
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {link.label}
                  </motion.span>
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                      layoutId="underline"
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                  {!isActive(link.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Link
                to="/valoracion"
                className="btn-primary text-sm"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Valorar Propiedad
                </motion.span>
              </Link>
            </motion.div>
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <LanguageSelector />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <motion.button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="md:hidden mt-4 space-y-4 overflow-hidden"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 font-medium transition-colors duration-300 ${
                      isActive(link.path)
                        ? 'text-gold'
                        : 'text-white hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  delay: navLinks.length * 0.05,
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <Link
                  to="/valoracion"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary text-sm inline-block"
                >
                  Valorar Propiedad
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header

