import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import API from '../api'
import Modal from '../components/Modal'
import { styles } from '../styles'


const STATUS = ['NA_FILA', 'ENVIADO', 'ENTREGUE']
const PRIORITY = ['NORMAL', 'URGENTE']

export default function LettersPage() {
  const [letters, setLetters] = useState([])
  const [clients, setClients] = useState([])
  const [pigeons, setPigeons] = useState([])
  const [msg, setMsg] = useState(null)
  const [editing, setEditing] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()
  const [search, setSearch] = useState(''); // inicia vazio

  const loadAll = () => {
    API.get('/letters').then(setLetters).catch(e => console.error(e))
    API.get('/clients').then(setClients).catch(e => console.error(e))
    API.get('/pigeons').then(setPigeons).catch(e => console.error(e))
  }
  useEffect(() => { loadAll() }, [])

  const create = async (data) => {

    try {

      const payload = {
        content: data.content,
        address: data.address,
        recipientId: data.recipientId,
        senderId: data.senderId,
        pigeonId: data.pigeonId || undefined, // Envia como undefined se vazio
        distanceKm: data.distanceKm || undefined,
        priority: data.priority,
        note: data.note || undefined
      };

      await API.post('/letters', data)
      setMsg({ type: 'success', text: 'Carta criada' })
      loadAll()
      reset()
    } catch (err) {
      setMsg({ type: 'error', text: String(err) })
    }
  }

  const setSignature = async (letterId, file) => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      await API.postForm('/letters/' + letterId + '/signature', fd)
      setMsg({ type: 'success', text: 'Assinatura enviada' })
      loadAll()
    } catch (err) {
      setMsg({ type: 'error', text: String(err) })
    }
  }

  const updateStatus = async (letter, newStatus) => {
    // Impede alteração se já estiver entregue
    if (letter.status === 'ENTREGUE') {
      alert('Carta já entregue — não é possível alterar.');
      return;
    }

    // Define as transições permitidas
    const allowedTransitions = {
      'NA_FILA': ['ENVIADO'],       // Só pode ir para ENVIADO
      'ENVIADO': ['ENTREGUE'],      // Só pode ir para ENTREGUE
      'ENTREGUE': []                // Não pode mudar mais
    };

    // Verifica se a transição é permitida
    if (!allowedTransitions[letter.status].includes(newStatus)) {
      alert(`Não é possível mudar de ${letter.status} para ${newStatus}. ` +
        `Transições permitidas: ${allowedTransitions[letter.status].join(', ') || 'nenhuma'}`);
      return;
    }

    try {
      await API.put('/letters/' + letter.id, { status: newStatus });
      setMsg({ type: 'success', text: 'Status atualizado' });
      loadAll();
    } catch (err) {
      setMsg({ type: 'error', text: String(err) });
    }
  };

  const openEdit = (l) => {
    if (l.status === 'ENTREGUE') { alert('Carta entregue — não pode ser editada.'); return }
    setEditing(l)
    setValue('content', l.content)
    setValue('address', l.address)
    setValue('distanceKm', l.distanceKm)
    setValue('priority', l.priority)
    setValue('pigeonId', l.pigeon?.id || '')
    setValue('senderId', l.sender?.id);       // <--- aqui
    setValue('recipientId', l.recipient?.id); // <--- aqui
  }

  const saveEdit = async (d) => {
    try {
      const updateData = {
        content: d.content,
        address: d.address,
        distanceKm: d.distanceKm || undefined,
        priority: d.priority,
        pigeonId: d.pigeonId || undefined,
        note: d.note || undefined
      };

      await API.put('/letters/' + editing.id, updateData);
      setMsg({ type: 'success', text: 'Carta atualizada' });
      setEditing(null);
      loadAll();
    } catch (err) {
      setMsg({ type: 'error', text: String(err) });
    }
  };

  const filteredPigeons = pigeons.filter(p =>
    p.nickname.toLowerCase().includes(search.toLowerCase())
  );

const modalStyles = {
  modalContent: {
    maxHeight: '90vh', // Altura máxima relativa à viewport
    overflowY: 'auto', // Habilita scroll vertical se necessário
    margin: 'auto', // Centraliza o modal
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  modalBody: {
    padding: '1.5rem',
  },
};

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Cartas</h2>

      {/* Card de Nova Carta */}
      <div style={styles.card}>
        {/* Cabeçalho clicável */}
        <div
          style={{
            ...styles.cardHeader,
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 style={styles.cardTitle}>
            Nova Carta {collapsed ? '▼' : '▲'}
          </h3>
        </div>
        {!collapsed && (
          <div style={styles.cardBody}>
            {msg && (
              <div style={msg.type === 'error' ? styles.alertError : styles.alertSuccess}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit(create)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Conteúdo*</label>
                  <textarea
                    style={styles.formTextarea}
                    {...register('content', { required: 'Conteúdo obrigatório' })}
                    rows={5}
                  />
                  {errors.content && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.content.message}</div>}
                </div>

                <div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Endereço*</label>
                    <input
                      style={styles.formInput}
                      {...register('address', { required: 'Endereço obrigatório' })}
                    />
                    {errors.address && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.address.message}</div>}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Remetente*</label>
                    <select
                      style={styles.formSelect}
                      {...register('senderId', { required: 'Remetente obrigatório' })}
                    >
                      <option value="">Escolha</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.senderId && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.senderId.message}</div>}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Destinatário*</label>
                    <select
                      style={styles.formSelect}
                      {...register('recipientId', { required: 'Destinatário obrigatório' })}
                    >
                      <option value="">Escolha</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.recipientId && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.recipientId.message}</div>}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}> Nota </label>
                  <input
                    style={styles.formInput}
                    placeholder="adicionar nota"
                    {...register('note')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Escolher Pombo </label>
                  <select style={styles.formSelect} {...register('pigeonId')}>
                    <option value="">Escolha um Pombo</option>
                    {filteredPigeons.map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Distância estimada (km)</label>
                  <input
                    style={styles.formInput}
                    type="number"
                    {...register('distanceKm', { valueAsNumber: true })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Prioridade</label>
                  <select style={styles.formSelect} {...register('priority')}>
                    <option value="NORMAL">Normal</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  type="submit"
                >
                  Criar Carta
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Lista de Cartas */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Lista de Cartas</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Conteúdo</th>
                  <th style={styles.tableHeader}>Dest.</th>
                  <th style={styles.tableHeader}>Remet.</th>
                  <th style={styles.tableHeader}>Pombo</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Prioridade</th>
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {letters.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.textMuted, ...styles.textCenter, padding: '1rem' }}>
                      Nenhuma carta encontrada
                    </td>
                  </tr>
                )}
                {letters.map(l => (
                  <tr key={l.id} style={styles.tableRow}>
                    <td style={{ ...styles.tableCell, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.content}
                    </td>
                    <td style={styles.tableCell}>{l.recipient?.name}</td>
                    <td style={styles.tableCell}>{l.sender?.name}</td>
                    <td style={styles.tableCell}>{l.pigeon?.nickname || '-'}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor:
                          l.status === 'ENTREGUE' ? '#d4edda' :
                            l.status === 'ENVIADO' ? '#fff3cd' : '#e2e3e5',
                        color:
                          l.status === 'ENTREGUE' ? '#155724' :
                            l.status === 'ENVIADO' ? '#856404' : '#383d41'
                      }}>
                        {l.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{l.priority}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.flex}>
                        <button
                          style={{ ...styles.btn, ...styles.btnOutlinePrimary, ...styles.btnSmall }}
                          onClick={() => openEdit(l)}
                        >
                          Editar
                        </button>
                        <select
                          style={{
                            ...styles.formSelect,
                            padding: '0.25rem 0.5rem',
                            height: 'auto'
                          }}
                          value={l.status}
                          onChange={(e) => updateStatus(l, e.target.value)}
                        >
                          {STATUS.map(s => (
                            <option
                              key={s}
                              value={s}
                              disabled={
                                (l.status === 'NA_FILA' && s !== 'ENVIADO') ||
                                (l.status === 'ENVIADO' && s !== 'ENTREGUE') ||
                                (l.status === 'ENTREGUE')
                              }
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <div style={modalStyles.modalContent}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Editar Carta</h3>
              <button
                style={styles.closeButton}
                onClick={() => setEditing(null)}
              >
                &times;
              </button>
            </div>

            <div style={styles.cardBody}>
              <form onSubmit={handleSubmit(saveEdit)}>
                <div style={styles.formGrid}>
                  {/* Conteúdo */}
                  {/* Mostra (mas não edita) remetente e destinatário */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Remetente</label>
                    <input
                      style={styles.formInput}
                      value={editing.sender?.name}
                      readOnly
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Destinatário</label>
                    <input
                      style={styles.formInput}
                      value={editing.recipient?.name}
                      readOnly
                    />
                  </div>
                  <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.formLabel}>Conteúdo*</label>
                    <textarea
                      style={styles.formTextarea}
                      {...register('content', { required: 'Conteúdo obrigatório' })}
                      rows={5}
                    />
                    {errors.content && (
                      <div style={styles.errorText}>{errors.content.message}</div>
                    )}
                  </div>

                  {/* Endereço */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Endereço*</label>
                    <input
                      style={styles.formInput}
                      {...register('address', { required: 'Endereço obrigatório' })}
                    />
                  </div>

                  {/* Distância */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Distância estimada (km)</label>
                    <input
                      style={styles.formInput}
                      type="number"
                      {...register('distanceKm', { valueAsNumber: true })}
                    />
                  </div>

                  {/* Prioridade */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Prioridade</label>
                    <select style={styles.formSelect} {...register('priority')}>
                      <option value="NORMAL">Normal</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                  <input type="hidden" {...register('senderId')} />
                  <input type="hidden" {...register('recipientId')} />


                </div>

                {/* Histórico de status */}
                {/* Histórico de status */}
                <div style={{ marginTop: '1rem' }}>
                  <h4>Histórico de Alterações</h4>
                  <div style={{
                    maxHeight: '200px', // Altura máxima do contêiner
                    overflowY: 'auto',  // Habilita scroll vertical
                    border: '1px solid #ddd', // Opcional: borda para melhor visualização
                    borderRadius: '4px', // Opcional: bordas arredondadas
                    padding: '0.5rem',  // Opcional: espaçamento interno
                    backgroundColor: '#f9f9f9' // Opcional: cor de fundo
                  }}>
                    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                      {(editing.statusHistory || []).map((h, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                          <div>
                            <strong>{new Date(h.date).toLocaleString()}</strong>
                            {h.messages && h.messages.length > 0 && (
                              <ul style={{ paddingLeft: '1rem', margin: '0.5rem 0' }}>
                                {h.messages.map((msg, idx) => (
                                  <li key={idx}>{msg}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ações */}
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
