import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SolarSystemBackground from './components/SolarSystemBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chat from './components/Chat'
import SocketAlerts from './components/SocketAlerts'
import AsteroidExplorer from './pages/AsteroidExplorer'

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <SocketAlerts />
      <SolarSystemBackground />
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
      <Chat />
    </>
  )
}

export default App
