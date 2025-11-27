import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CookieProvider } from './context/CookieContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CookieBanner from './components/legal/CookieBanner'

// Pages
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Valuation from './pages/Valuation'
import SellProperty from './pages/SellProperty'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy from './pages/CookiePolicy'
import LegalNotice from './pages/LegalNotice'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CookieProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/propiedades" element={<Properties />} />
                  <Route path="/propiedades/:id" element={<PropertyDetail />} />
                  <Route path="/valoracion" element={<Valuation />} />
                  <Route path="/vender" element={<SellProperty />} />
                  <Route path="/servicios" element={<Services />} />
                  <Route path="/empresa" element={<About />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
                  <Route path="/politica-cookies" element={<CookiePolicy />} />
                  <Route path="/aviso-legal" element={<LegalNotice />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </Router>
        </CookieProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

