import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import API from '../api'
import Modal from '../components/Modal'
import { styles } from '../styles'

export default function PigeonsPage() {
  const [pigeons, setPigeons] = useState([])
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)
  const [newFile, setNewFile] = useState(null)
  const [editFile, setEditFile] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const load = () => API.get('/pigeons').then(setPigeons).catch(e => {
    console.error(e)
    setMessage({ type: 'error', text: 'Failed to load pigeons' })
  })

  useEffect(() => { load() }, [])

  const onCreate = async (data) => {
    try {
      const created = await API.post('/pigeons', data)
      if (newFile) {
        const fd = new FormData()
        fd.append('file', newFile)
        await API.postForm('/pigeons/' + created.id + '/photo', fd)
      }
      setMessage({ type: 'success', text: 'Pombo criado' })
      load()
      reset()
      setNewFile(null)
    } catch (err) {
      setMessage({ type: 'error', text: String(err) })
    }
  }

  const onEdit = (p) => {
    setEditing(p)
    setValue('nickname', p.nickname)
    setValue('averageSpeed', p.averageSpeed)
    setValue('age', p.age)
    setValue('maxDistanceKm', p.maxDistanceKm)
    setValue('healthStatus', p.healthStatus)
    setValue('notes', p.notes)
    setEditFile(null)
  }

  const saveEdit = async (data) => {
    try {
      await API.put('/pigeons/' + editing.id, data)
      if (editFile) {
        const fd = new FormData()
        fd.append('file', editFile)
        await API.postForm('/pigeons/' + editing.id + '/photo', fd)
      }
      setMessage({ type: 'success', text: 'Atualizado' })
      setEditing(null)
      setEditFile(null)
      reset()
      load()
    } catch (err) {
      setMessage({ type: 'error', text: String(err) })
    }
  }

  const retire = async (id) => {
    if (!window.confirm('Deseja aposentar esse pombo?')) return
    try {
      await API.patch('/pigeons/' + id + '/retire', {})
      setMessage({ type: 'success', text: 'Pombo aposentado' })
      load()
    } catch (err) {
      setMessage({ type: 'error', text: String(err) })
    }
  }

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Pombos</h2>
      
      <div style={styles.card}>
        <div 
          style={{ ...styles.cardHeader, cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 style={styles.cardTitle}>Novo Pombo {collapsed ? '▼' : '▲'}</h3>
        </div>
        
        {!collapsed && (
          <div style={styles.cardBody}>
            {message && (
              <div style={message.type === 'error' ? styles.alertError : styles.alertSuccess}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onCreate)}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Apelido*</label>
                  <input
                    style={styles.formInput}
                    {...register('nickname', { required: 'Apelido é obrigatório' })}
                  />
                  {errors.nickname && <div style={styles.errorText}>{errors.nickname.message}</div>}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Velocidade média</label>
                  <input
                    style={styles.formInput}
                    type="number"
                    {...register('averageSpeed', { valueAsNumber: true })}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Idade</label>
                  <input
                    style={styles.formInput}
                    placeholder="ex: 2 anos"
                    {...register('age')}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Alcance máximo (km)</label>
                  <input
                    style={styles.formInput}
                    type="number"
                    {...register('maxDistanceKm', { valueAsNumber: true })}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Status de saúde</label>
                  <select style={styles.formSelect} {...register('healthStatus')}>
                    <option value="">--</option>
                    <option value="ACTIVE">Ativo</option>
                    <option value="REST">Em descanso</option>
                    <option value="TREATMENT">Em tratamento</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Foto</label>
                  <input 
                    type="file" 
                    onChange={e => setNewFile(e.target.files?.[0])}
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.formLabel}>Observações</label>
                  <textarea
                    style={styles.formTextarea}
                    {...register('notes')}
                    rows={3}
                  />
                </div>
              </div>
              
              <div style={styles.formActions}>
                <button 
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  type="submit"
                >
                  Criar Pombo
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Lista de Pombos</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Foto</th>
                  <th style={styles.tableHeader}>Apelido</th>
                  <th style={styles.tableHeader}>Velocidade</th>
                  <th style={styles.tableHeader}>Alcance</th>
                  <th style={styles.tableHeader}>Saúde</th>
                  <th style={styles.tableHeader}>Entregas</th>
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pigeons.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.textMuted, ...styles.textCenter, padding: '1rem' }}>
                      Nenhum pombo encontrado
                    </td>
                  </tr>
                )}
                {pigeons.map(p => (
                  <tr key={p.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <img 
                        src={p.photo || '/uploads/placeholder.png'} 
                        style={styles.previewImg} 
                        alt={p.nickname} 
                      />
                    </td>
                    <td style={styles.tableCell}>{p.nickname}</td>
                    <td style={styles.tableCell}>{p.averageSpeed ?? '-'}</td>
                    <td style={styles.tableCell}>{p.maxDistanceKm ?? '-'}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        color: 
                          p.healthStatus === 'ACTIVE' ? '#28a745' :
                          p.healthStatus === 'TREATMENT' ? '#dc3545' :
                          '#ffc107'
                      }}>
                        {p.healthStatus ?? '-'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{p.deliveriesCount ?? 0}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.flex}>
                        <button 
                          style={{ ...styles.btn, ...styles.btnOutlinePrimary, ...styles.btnSmall }}
                          onClick={() => onEdit(p)}
                        >
                          Editar
                        </button>
                        {!p.retired && (
                          <button 
                            style={{ ...styles.btn, ...styles.btnSecondary, ...styles.btnSmall }}
                            onClick={() => retire(p.id)}
                          >
                            Aposentar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <Modal onClose={() => {
          setEditing(null)
          setEditFile(null)
          reset()
        }}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Editar Pombo</h3>
              <button 
                style={styles.closeButton}
                onClick={() => {
                  setEditing(null)
                  setEditFile(null)
                  reset()
                }}
              >
                &times;
              </button>
            </div>
            <div style={styles.cardBody}>
              <form onSubmit={handleSubmit(saveEdit)}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Apelido*</label>
                    <input
                      style={styles.formInput}
                      {...register('nickname', { required: 'Apelido é obrigatório' })}
                    />
                    {errors.nickname && <div style={styles.errorText}>{errors.nickname.message}</div>}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Velocidade média</label>
                    <input
                      style={styles.formInput}
                      type="number"
                      {...register('averageSpeed', { valueAsNumber: true })}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Idade</label>
                    <input
                      style={styles.formInput}
                      placeholder="ex: 2 anos"
                      {...register('age')}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Alcance máximo (km)</label>
                    <input
                      style={styles.formInput}
                      type="number"
                      {...register('maxDistanceKm', { valueAsNumber: true })}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Status de saúde</label>
                    <select style={styles.formSelect} {...register('healthStatus')}>
                      <option value="">--</option>
                      <option value="ACTIVE">Ativo</option>
                      <option value="REST">Em descanso</option>
                      <option value="TREATMENT">Em tratamento</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Foto</label>
                    <input 
                      type="file" 
                      onChange={e => setEditFile(e.target.files?.[0])}
                      style={{ padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.formLabel}>Observações</label>
                    <textarea
                      style={styles.formTextarea}
                      {...register('notes')}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div style={styles.formActions}>
                  <button
                    style={{ ...styles.btn, ...styles.btnSecondary, marginRight: '0.5rem' }}
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setEditFile(null)
                      reset()
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    type="submit"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}