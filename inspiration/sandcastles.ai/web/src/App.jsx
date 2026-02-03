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
import Channels from './pages/dashboard/Channels'
import Videos from './pages/dashboard/Videos'
import Projects from './pages/dashboard/Projects'
import Vault from './pages/dashboard/Vault'
import Exports from './pages/dashboard/Exports'
import Settings from './pages/dashboard/Settings'
import BuildWatchlist from './pages/dashboard/BuildWatchlist'
import ChannelVideos from './pages/dashboard/ChannelVideos'

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
        <Route path="/dashboard/channels" element={<Channels />} />
        <Route path="/dashboard/videos" element={<Videos />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/vault" element={<Vault />} />
        <Route path="/dashboard/exports" element={<Exports />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/build-watchlist" element={<BuildWatchlist />} />
        <Route path="/dashboard/channel-videos" element={<ChannelVideos />} />
      </Routes>
    </Router>
  )
}

export default App
