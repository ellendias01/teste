import React, { useEffect, useState } from 'react';

export default function Pigeons() {
  const [pigeons, setPigeons] = useState([]);
  const [form, setForm] = useState({ nickname: '', averageSpeed: '' });

  useEffect(() => {
    fetch('/pigeons').then(r => r.json()).then(setPigeons);
  }, []);

  const create = async () => {
    await fetch('/pigeons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: form.nickname, averageSpeed: parseFloat(form.averageSpeed) || null })
    });
    const res = await fetch('/pigeons');
    setPigeons(await res.json());
    setForm({ nickname: '', averageSpeed: '' });
  };

  const retire = async (id) => {
    await fetch(`/pigeons/${id}/retire`, { method: 'PATCH' });
    setPigeons(pigeons.map(p => (p.id === id ? { ...p, retired: true } : p)));
  };

  return (
    <div>
      <h2>Pombos</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Apelido" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} />
        <input placeholder="Velocidade média" value={form.averageSpeed} onChange={e => setForm({ ...form, averageSpeed: e.target.value })} />
        <button onClick={create}>Criar</button>
      </div>
      <table border="1" cellPadding="6">
        <thead><tr><th>Apelido</th><th>Velocidade</th><th>Aposentado</th><th>Ações</th></tr></thead>
        <tbody>
          {pigeons.map(p => (
            <tr key={p.id}>
              <td>{p.nickname}</td>
              <td>{p.averageSpeed}</td>
              <td>{p.retired ? 'Sim' : 'Não'}</td>
              <td>
                {!p.retired && <button onClick={() => retire(p.id)}>Aposentar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
