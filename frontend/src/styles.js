export const styles = {
  // General styles
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f5f5'
  },
  pageContainer: {
    
    maxWidth: '1200px',
    width: '100%',
   
  },
  pageTitle: {
    color: '#4a90e2',
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    fontWeight: '600'
  },

  // Cards
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '0.5rem',
    overflow: 'hidden',
    
  },
  cardHeader: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    
   
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '500'
    
  },
  cardBody: {
    padding: '1.5rem'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0 0.5rem'
  },

  // Forms
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    margin: '1rem',
  },
  formGroup: {
    marginBottom: '1rem'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#555'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  formSelect: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  formTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical'
  },
  formActions: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  },

  // Buttons
  btn: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  btnPrimary: {
    backgroundColor: '#e27a4aff',
    color: 'white',
    '&:hover': {
      backgroundColor: '#3a7bc8'
    }
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
    color: 'white',
    '&:hover': {
      backgroundColor: '#5a6268'
    }
  },
  btnOutlinePrimary: {
    backgroundColor: 'transparent',
    color: '#4a90e2',
    border: '1px solid #4a90e2',
    '&:hover': {
      backgroundColor: '#f0f7ff'
    }
  },
  btnSmall: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem'
  },

  // Tables
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#555',
    borderBottom: '1px solid #eee'
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    '&:hover': {
      backgroundColor: '#f9f9f9'
    }
  },
  tableCell: {
    padding: '0.75rem',
    textAlign: 'left'
  },
  tableResponsive: {
    overflowX: 'auto'
  },

  // Alerts
  alertSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #c3e6cb'
  },
  alertError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #f5c6cb'
  },

  // Utilities
  textMuted: {
    color: '#6c757d'
  },
  textCenter: {
    textAlign: 'center'
  },
  flex: {
    display: 'flex',
    gap: '0.5rem',
 
  },
  previewImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  }
}