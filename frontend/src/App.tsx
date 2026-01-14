import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CookieProvider } from './context/CookieContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CookieBanner from './components/legal/CookieBanner'
import FloatingAssistant from './components/ui/FloatingAssistant'

// Pages
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Valuation from './pages/Valuation'
import SellProperty from './pages/SellProperty'
import Services from './pages/Services'
import Insurance from './pages/Insurance'
import InsuranceForm from './pages/InsuranceForm'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy from './pages/CookiePolicy'
import LegalNotice from './pages/LegalNotice'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CookieProvider>
          <Router>
          <div className="min-h-screen flex flex-col bg-black-soft">
            <Header />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/propiedades" element={<Properties />} />
                <Route path="/propiedades/:id" element={<PropertyDetail />} />
                <Route path="/valoracion" element={<Valuation />} />
                <Route path="/vender" element={<SellProperty />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/seguros" element={<Insurance />} />
                <Route path="/seguros/:tipo" element={<InsuranceForm />} />
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
            <FloatingAssistant />
          </div>
          </Router>
        </CookieProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

