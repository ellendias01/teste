import React, { useEffect, useState } from 'react';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import API from './API';

export default function Letters() {
  const [letters, setLetters] = useState([]);
  const [clients, setClients] = useState([]);
  const [pigeons, setPigeons] = useState([]);
  const [form, setForm] = useState({ content: '', address: '', recipientId: '', senderId: '', pigeonId: '' });

  const loadAll = () => {
    API.get('/letters').then(setLetters).catch(console.error);
    API.get('/clients').then(setClients).catch(console.error);
    API.get('/pigeons').then(setPigeons).catch(console.error);
  };

  useEffect(() => { loadAll(); }, []);

  const create = async () => {
    try {
      await API.post('/letters', form);
      setForm({ content: '', address: '', recipientId: '', senderId: '', pigeonId: '' });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <h2>Cartas</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Conteúdo" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <input placeholder="Endereço" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <select value={form.senderId} onChange={e => setForm({ ...form, senderId: e.target.value })}>
          <option value="">Remetente</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.recipientId} onChange={e => setForm({ ...form, recipientId: e.target.value })}>
          <option value="">Destinatário</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.pigeonId} onChange={e => setForm({ ...form, pigeonId: e.target.value })}>
          <option value="">Pombo (opcional)</option>
          {pigeons.filter(p => !p.retired).map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
        </select>
        <button onClick={create}>Criar</button>
      </div>

      <table border="1" cellPadding="6">
        <thead><tr><th>Conteúdo</th><th>Destinatário</th><th>Remetente</th><th>Pombo</th><th>Status</th></tr></thead>
        <tbody>
          {letters.map(l => (
            <tr key={l.id}>
              <td>{l.content}</td>
              <td>{l.recipient?.name}</td>
              <td>{l.sender?.name}</td>
              <td>{l.pigeon?.nickname || '-'}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
