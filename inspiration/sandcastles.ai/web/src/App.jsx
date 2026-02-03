import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Login from './pages/Login'
import Trial from './pages/Trial'

import DashboardHome from './pages/dashboard/Home'
import Analysis from './pages/dashboard/Analysis'
import Writer from './pages/dashboard/Writer'

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/analysis" element={<Analysis />} />
        <Route path="/dashboard/writer" element={<Writer />} />
      </Routes>
    </Router>
  )
}

export default App
