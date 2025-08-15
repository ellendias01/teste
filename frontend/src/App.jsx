import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import PigeonsPage from './pages/PigeonsPage'
import ClientsPage from './pages/ClientsPage'
import LettersPage from './pages/LettersPage'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation() // Hook para obter a localização atual

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .nav-button.active {
          animation: pulse 1.5s infinite;
        }
      `}</style>
      
      <header style={styles.header}>
        <h1 style={styles.title}>Pigeon Delivery</h1>
        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navButton,
              ...(location.pathname === '/' && styles.activeButton)
            }}
            onClick={() => navigate('/')}
          >
            <span style={styles.buttonIcon}>🏠</span> Home
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(location.pathname === '/pigeons' && styles.activeButton)
            }}
            onClick={() => navigate('/pigeons')}
          >
            <span style={styles.buttonIcon}>🐦</span> Pombos
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(location.pathname === '/clients' && styles.activeButton)
            }}
            onClick={() => navigate('/clients')}
          >
            <span style={styles.buttonIcon}>👥</span> Clientes
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(location.pathname === '/letters' && styles.activeButton)
            }}
            onClick={() => navigate('/letters')}
          >
            <span style={styles.buttonIcon}>✉️</span> Cartas
          </button>
        </nav>
      </header>

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pigeons" element={<PigeonsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/letters" element={<LettersPage />} />
        </Routes>
      </div>
    </div>
  )
}

// Estilos como objeto JavaScript
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  activeButton: {
    backgroundColor: 'white',
    color: '#4a90e2',
    boxShadow: '0 0 0 3px rgba(255,255,255,0.5)',
    fontWeight: '600'
  },
  buttonIcon: {
    fontSize: '1.2rem'
  },
  content: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  }
}