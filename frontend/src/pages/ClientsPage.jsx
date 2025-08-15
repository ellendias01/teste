import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../api';
import Modal from '../components/Modal';
import { styles } from '../styles';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [pigeons, setPigeons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const load = () => {
    API.get('/clients').then(setClients).catch(e => console.error(e));
    API.get('/pigeons').then(setPigeons).catch(e => console.error(e));
  };

  useEffect(() => { load(); }, []);

  const create = async (data) => {
    try {
      await API.post('/clients', data);
      setMsg({ type: 'success', text: 'Cliente criado' });
      load();
      reset();
    } catch (err) {
      setMsg({ type: 'error', text: String(err) });
    }
  };

  const onEdit = (c) => {
    setEditing(c);
    setValue('name', c.name);
    setValue('email', c.email);
    setValue('address', c.address);
    setValue('birthDate', c.birthDate ? c.birthDate.split('T')[0] : '');
    setValue('phone', c.phone);
    setValue('city', c.city);
    setValue('state', c.state);
    setValue('number', c.number || '');
    setValue('complement', c.complement || '');
    setValue('neighborhood', c.neighborhood || '');
    setValue('favoritePigeon', c.favoritePigeon?.id || '');
  };

  const save = async (data) => {
    try {
      if (data.favoritePigeon) {
        data.favoritePigeonId = data.favoritePigeon;
        delete data.favoritePigeon;
      }
      
      const updatedClient = await API.put(`/clients/${editing.id}`, data);
      setMsg({ type: 'success', text: 'Cliente atualizado' });
      setEditing(null);
      setClients(clients.map(c => c.id === editing.id ? updatedClient : c));
    } catch (err) {
      setMsg({ type: 'error', text: String(err) });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Clientes</h2>
      
      {/* Card de Novo Cliente */}
      <div style={styles.card}>
        <div 
          style={{ ...styles.cardHeader, cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 style={styles.cardTitle}>
            Novo Cliente {collapsed ? '▼' : '▲'}
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
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome*</label>
                  <input 
                    style={styles.formInput} 
                    {...register('name', { required: 'Nome obrigatório' })} 
                  />
                  {errors.name && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.name.message}</div>}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Telefone</label>
                  <input style={styles.formInput} {...register('phone')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Data de Nascimento</label>
                  <input type="date" style={styles.formInput} {...register('birthDate')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email*</label>
                  <input
                    style={styles.formInput}
                    {...register('email', {
                      required: 'Email obrigatório',
                      pattern: { value: /^\S+@\S+$/, message: 'Email inválido' },
                    })}
                  />
                  {errors.email && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.email.message}</div>}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Endereço</label>
                  <input style={styles.formInput} {...register('address')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Número</label>
                  <input style={styles.formInput} {...register('number')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Bairro</label>
                  <input style={styles.formInput} {...register('neighborhood')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Complemento</label>
                  <input style={styles.formInput} {...register('complement')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Cidade</label>
                  <input style={styles.formInput} {...register('city')} />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Estado</label>
                  <input style={styles.formInput} {...register('state')} />
                </div>
                
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.formLabel}>Pombo favorito</label>
                  <select style={styles.formSelect} {...register('favoritePigeon')}>
                    <option value="">Nenhum</option>
                    {pigeons.map(p => (
                      <option key={p.id} value={p.id}>{p.nickname}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  type="submit"
                >
                  Criar Cliente
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Lista de Clientes */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Lista de Clientes</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Nome</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Telefone</th>
                  <th style={styles.tableHeader}>Cidade</th>
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ ...styles.textMuted, ...styles.textCenter, padding: '1rem' }}>
                      Nenhum cliente cadastrado
                    </td>
                  </tr>
                )}
                {clients.map(c => (
                  <tr key={c.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{c.name}</td>
                    <td style={styles.tableCell}>{c.email}</td>
                    <td style={styles.tableCell}>{c.phone}</td>
                    <td style={styles.tableCell}>{c.city}{c.state && ` - ${c.state}`}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.flex}>
                        <button 
                          style={{ ...styles.btn, ...styles.btnOutlinePrimary, ...styles.btnSmall }}
                          onClick={() => onEdit(c)}
                        >
                          Editar
                        </button>
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
        <Modal onClose={() => setEditing(null)} >
          <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>Editar Cliente</h3>
                      <button
                        onClick={() => setEditing(null)}
                        style={styles.closeButton}
                      >
                        &times;
                      </button>
                    </div>
          <form onSubmit={handleSubmit(save)}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nome*</label>
                <input 
                  style={styles.formInput} 
                  {...register('name', { required: 'Nome obrigatório' })} 
                />
                {errors.name && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.name.message}</div>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Telefone</label>
                <input style={styles.formInput} {...register('phone')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Data de Nascimento</label>
                <input type="date" style={styles.formInput} {...register('birthDate')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email*</label>
                <input
                  style={styles.formInput}
                  {...register('email', {
                    required: 'Email obrigatório',
                    pattern: { value: /^\S+@\S+$/, message: 'Email inválido' },
                  })}
                />
                {errors.email && <div style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.email.message}</div>}
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Endereço</label>
                <input style={styles.formInput} {...register('address')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Número</label>
                <input style={styles.formInput} {...register('number')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Bairro</label>
                <input style={styles.formInput} {...register('neighborhood')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Complemento</label>
                <input style={styles.formInput} {...register('complement')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Cidade</label>
                <input style={styles.formInput} {...register('city')} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Estado</label>
                <input style={styles.formInput} {...register('state')} />
              </div>
              
              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.formLabel}>Pombo favorito</label>
                <select style={styles.formSelect} {...register('favoritePigeon')}>
                  <option value="">Nenhum</option>
                  {pigeons.map(p => (
                    <option key={p.id} value={p.id}>{p.nickname}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ margin: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
              <button 
                style={{ ...styles.btn, ...styles.btnSecondary }}
                type="button"
                onClick={() => setEditing(null)}
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
        </Modal>
      )}
    </div>
  );
}