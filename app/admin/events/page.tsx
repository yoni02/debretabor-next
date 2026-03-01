'use client';

import { useEffect, useState } from 'react';
import type { ChurchEvent, EventType } from '@/lib/eventData';

const EMPTY: Omit<ChurchEvent, '_id'> = { title: '', date: '', time: '6:00 AM', type: 'liturgy', desc: '' };

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
  border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5',
  fontSize: '0.9rem', color: '#3d3529', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem',
  color: '#6b5d4d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [form, setForm] = useState<Omit<ChurchEvent, '_id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function fetchEvents() {
    const res = await fetch('/api/events');
    setEvents(await res.json());
  }

  useEffect(() => { fetchEvents(); }, []);

  function startEdit(ev: ChurchEvent) {
    setEditId(ev._id ?? null);
    setForm({ title: ev.title, date: ev.date, time: ev.time, type: ev.type, desc: ev.desc });
  }

  function cancelEdit() { setEditId(null); setForm(EMPTY); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const url = editId ? `/api/events/${editId}` : '/api/events';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      setMsg(editId ? 'Event updated.' : 'Event added.');
      cancelEdit();
      await fetchEvents();
    } catch {
      setMsg('Error saving event.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setMsg('Event deleted.');
    await fetchEvents();
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: '#b8860b', marginBottom: '1.5rem' }}>
        {editId ? 'Edit Event' : 'Add Event'}
      </h1>

      <form onSubmit={handleSubmit} style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20, padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 2px 12px rgba(61,53,41,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        </div>
        <div>
          <label style={labelStyle}>Time</label>
          <input style={inputStyle} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}>
            <option value="liturgy">Liturgy</option>
            <option value="feast">Feast</option>
            <option value="study">Bible Study</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="submit" disabled={loading} style={{ padding: '0.7rem 2rem', borderRadius: 999, background: 'linear-gradient(135deg, #c9a227, #b8860b)', color: '#faf8f5', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            {loading ? 'Saving…' : editId ? 'Update Event' : 'Add Event'}
          </button>
          {editId && <button type="button" onClick={cancelEdit} style={{ padding: '0.7rem 1.5rem', borderRadius: 999, background: 'transparent', color: '#6b5d4d', border: '1px solid rgba(184,168,138,0.5)', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>}
          {msg && <span style={{ color: '#b8860b', fontSize: '0.85rem' }}>{msg}</span>}
        </div>
      </form>

      <h2 style={{ fontSize: '1.2rem', color: '#b8860b', marginBottom: '1rem' }}>All Events ({events.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {events.map(ev => (
          <div key={ev._id} style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 14, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 8px rgba(61,53,41,0.05)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: ev.type === 'liturgy' ? '#7A1818' : ev.type === 'feast' ? '#C8941A' : '#1A3478' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#3d3529', marginBottom: '0.1rem' }}>{ev.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b5d4d' }}>{ev.date} · {ev.time} · {ev.type}</div>
            </div>
            <button onClick={() => startEdit(ev)} style={{ padding: '0.4rem 1rem', borderRadius: 8, background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(184,134,11,0.3)', color: '#b8860b', cursor: 'pointer', fontSize: '0.82rem' }}>Edit</button>
            <button onClick={() => handleDelete(ev._id!)} style={{ padding: '0.4rem 1rem', borderRadius: 8, background: 'rgba(122,24,24,0.08)', border: '1px solid rgba(122,24,24,0.2)', color: '#7A1818', cursor: 'pointer', fontSize: '0.82rem' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
