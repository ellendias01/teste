import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styles } from '../styles'

export default function Home() {
  const nav = useNavigate()
  
  return (
    <div style={styles.pageContainer}>
      <div style={{ 
        ...styles.card, 
        background: 'linear-gradient(135deg, #4a90e2 0%, #3a7bc8 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
        }}>
          Entrega pelo céu — com pombos-correio 🕊️
        </h2>
        <p style={{ 
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Um serviço lúdico e orgânico para enviar mensagens especiais. Escolha um pombo, escreva sua carta e deixe o resto com a natureza.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            style={{ ...styles.btn, ...styles.btnPrimary, padding: '1rem 2rem' }}
            onClick={() => nav('/clients')}
          >
            Cadastrar-se
          </button>
          <button 
            style={{ ...styles.btn, ...styles.btnOutlinePrimary, padding: '1rem 2rem', color: 'white', borderColor: 'white' }}
            onClick={() => nav('/letters')}
          >
            Já tenho conta
          </button>
        </div>
        <p style={{ 
          marginTop: '2rem',
          fontStyle: 'italic',
          opacity: 0.8,
          fontSize: '0.9rem'
        }}>
          Dica: na página de cartas você pode escolher o pombo que fará a entrega. Pombos aposentados não aparecem como opção.
        </p>
      </div>
    </div>
  )
}