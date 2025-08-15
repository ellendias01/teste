import React, { useEffect, useState } from 'react';
import { useState, useEffect } from 'react';
import API from './API';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', number: '', complement: '', neighborhood: '' });

   const loadClients = () => {
    API.get('/clients')
      .then(setClients)
      .catch(err => console.error(err));
  };

  useEffect(() => { loadClients(); }, []);

   const create = async () => {
    try {
      await API.post('/clients', form);
      setForm({ name: '', email: '', address: '', number: '', complement: '', neighborhood: '' });
      loadClients();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h2>Clientes</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
         <input placeholder="Data de Nascimento" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
        <input placeholder="Endereço" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <input type="number" placeholder="Número da residência" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
        <input placeholder="Complemento" value={form.complement} onChange={e => setForm({ ...form, complement: e.target.value })} />
        <input placeholder="Bairro" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} />
        <button onClick={create}>Criar</button>
      </div>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Data de Nascimento</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Endereço</th>
            <th>Número</th>
            <th>Complemento</th>
            <th>Bairro</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.birthDate}</td>
              <td>{c.address}</td>
              <td>{c.number}</td>
              <td>{c.city} {c.state && '- ' + c.state}</td>
              <td>{c.number}</td>
              <td>{c.complement}</td>
              <td>{c.neighborhood}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
