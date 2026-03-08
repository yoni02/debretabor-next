'use client';

import { useEffect, useState } from 'react';
import type { ChurchEvent, EventType } from '@/lib/eventData';

const EMPTY: Omit<ChurchEvent, '_id'> = { title: '', date: '', time: '6:00 AM', type: 'liturgy', description: '' };

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ['00', '15', '30', '45'];

function parseTime(val: string) {
  const m = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m) return { hour: m[1], minute: m[2], period: m[3].toUpperCase() as 'AM' | 'PM' };
  return { hour: '6', minute: '00', period: 'AM' as const };
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseTime(value);
  const [hour,   setHour]   = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period);

  useEffect(() => {
    const p = parseTime(value);
    setHour(p.hour); setMinute(p.minute); setPeriod(p.period);
  }, [value]);

  function emit(h: string, m: string, p: string) { onChange(`${h}:${m} ${p}`); }

  const sel: React.CSSProperties = {
    padding: '0.65rem 0.5rem', borderRadius: 10, border: '1px solid rgba(184,168,138,0.5)',
    background: '#faf8f5', fontSize: '0.9rem', color: '#3d3529', cursor: 'pointer',
    appearance: 'none', textAlign: 'center', fontWeight: 600,
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {/* Hour */}
      <select style={{ ...sel, width: 70 }} value={hour}
        onChange={e => { setHour(e.target.value); emit(e.target.value, minute, period); }}>
        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span style={{ color: '#6b5d4d', fontWeight: 700, fontSize: '1.1rem' }}>:</span>
      {/* Minute */}
      <select style={{ ...sel, width: 70 }} value={minute}
        onChange={e => { setMinute(e.target.value); emit(hour, e.target.value, period); }}>
        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      {/* AM / PM */}
      <select style={{ ...sel, width: 70 }} value={period}
        onChange={e => { const p = e.target.value as 'AM' | 'PM'; setPeriod(p); emit(hour, minute, p); }}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

const TYPE_META: Record<EventType, { label: string; color: string; bg: string }> = {
  liturgy:    { label: 'Liturgy',    color: '#7A1818', bg: 'rgba(122,24,24,0.1)' },
  feast:      { label: 'Feast',      color: '#b8860b', bg: 'rgba(184,134,11,0.1)' },
  study:      { label: 'Bible Study', color: '#1A3478', bg: 'rgba(26,52,120,0.1)' },
  fellowship: { label: 'Fellowship', color: '#2d6a2d', bg: 'rgba(45,106,45,0.1)' },
};

const I = (style: React.CSSProperties = {}): React.CSSProperties => ({
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
  border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5',
  fontSize: '0.9rem', color: '#3d3529', boxSizing: 'border-box', ...style,
});
const LABEL: React.CSSProperties = {
  display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem',
  color: '#6b5d4d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<ChurchEvent[]>([]);
  const [form,    setForm]    = useState<Omit<ChurchEvent, '_id'>>(EMPTY);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [filter,  setFilter]  = useState<EventType | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  async function fetchEvents() {
    const res = await fetch('/api/events');
    setEvents(await res.json());
  }
  useEffect(() => { fetchEvents(); }, []);

  function startEdit(ev: ChurchEvent) {
    setEditId(ev._id ?? null);
    setForm({ title: ev.title, date: ev.date, time: ev.time, type: ev.type, description: ev.description });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditId(null); setForm(EMPTY); setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const url    = editId ? `/api/events/${editId}` : '/api/events';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.details || 'Unknown error');
      }
      setMsg(editId ? '✓ Event updated.' : '✓ Event added.');
      cancelEdit();
      await fetchEvents();
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : 'Error saving event'}`);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setMsg('✓ Event deleted.');
    await fetchEvents();
  }


  // Liturgy events are auto-managed — hide them from the admin list
  const nonLiturgy = events.filter(ev => ev.type !== 'liturgy');
  const filtered = nonLiturgy.filter(ev => filter === 'all' || ev.type === filter);
  const grouped: Record<string, ChurchEvent[]> = {};
  filtered.forEach(ev => {
    const key = ev.date ? ev.date.slice(0, 7) : 'Unknown';
    (grouped[key] = grouped[key] || []).push(ev);
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', color: '#b8860b', margin: 0 }}>Events &amp; Calendar</h1>
          <p style={{ color: '#6b5d4d', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            {nonLiturgy.length} special event{nonLiturgy.length !== 1 ? 's' : ''}
            <span style={{ marginLeft: 8, padding: '0.15rem 0.6rem', borderRadius: 999, fontSize: '0.72rem', background: 'rgba(122,24,24,0.08)', color: '#7A1818', fontWeight: 600 }}>
              ⛪ Sunday Divine Liturgy auto-scheduled
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {msg && <span style={{ fontSize: '0.85rem', color: msg.startsWith('✓') ? '#2d6a2d' : '#7A1818', fontWeight: 600 }}>{msg}</span>}
          <button onClick={() => { setShowForm(v => !v); if (showForm) cancelEdit(); }} style={{
            padding: '0.6rem 1.4rem', borderRadius: 999,
            background: showForm ? 'rgba(184,168,138,0.2)' : '#130804',
            color: showForm ? '#6b5d4d' : '#C8941A',
            border: '1px solid ' + (showForm ? 'rgba(184,168,138,0.4)' : '#C8941A'),
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            {showForm ? '✕ Cancel' : '+ Add Event'}
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#fff', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20,
          padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(61,53,41,0.07)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
        }}>
          <h2 style={{ gridColumn: '1/-1', fontSize: '1rem', color: '#b8860b', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid rgba(184,168,138,0.25)' }}>
            {editId ? '✏️ Edit Event' : '+ New Event'}
          </h2>

          {/* Type pills — pick before everything else */}
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(Object.entries(TYPE_META) as [EventType, typeof TYPE_META[EventType]][]).map(([type, meta]) => (
              <button key={type} type="button" onClick={() => setForm(f => ({ ...f, type }))} style={{
                padding: '0.45rem 1.1rem', borderRadius: 999, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                border: `2px solid ${meta.color}`,
                background: form.type === type ? meta.color : meta.bg,
                color: form.type === type ? '#fff' : meta.color,
                transition: 'all 0.12s',
              }}>{meta.label}</button>
            ))}
          </div>

          <div style={{ gridColumn: '1/-1' }}>
            <label style={LABEL}>Title</label>
            <input style={I()} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Fellowship Gathering, Palm Sunday…" />
          </div>
          <div>
            <label style={LABEL}>Date</label>
            <input type="date" style={I()} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
          </div>
          <div>
            <label style={LABEL}>Time</label>
            <TimeInput value={form.time} onChange={t => setForm(f => ({ ...f, time: t }))} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={LABEL}>Description</label>
            <textarea style={{ ...I(), minHeight: 80, resize: 'vertical' }} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the event…" />
          </div>

          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" disabled={loading} style={{
              padding: '0.7rem 2rem', borderRadius: 999,
              background: 'linear-gradient(135deg,#c9a227,#b8860b)', color: '#faf8f5',
              fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Saving…' : editId ? 'Update Event' : 'Add Event'}
            </button>
            <button type="button" onClick={cancelEdit} style={{
              padding: '0.7rem 1.5rem', borderRadius: 999, background: 'transparent',
              color: '#6b5d4d', border: '1px solid rgba(184,168,138,0.5)', cursor: 'pointer', fontSize: '0.9rem',
            }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filter tabs — liturgy hidden (auto-managed) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'feast', 'study', 'fellowship'] as (EventType | 'all')[]).map(t => {
          const meta = t === 'all' ? null : TYPE_META[t as EventType];
          const count = t === 'all' ? nonLiturgy.length : nonLiturgy.filter(e => e.type === t).length;
          const active = filter === t;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '0.4rem 1rem', borderRadius: 999, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              border: `1.5px solid ${active ? (meta?.color || '#3d3529') : 'rgba(184,168,138,0.4)'}`,
              background: active ? (meta?.bg || 'rgba(61,53,41,0.08)') : '#fff',
              color: active ? (meta?.color || '#3d3529') : '#6b5d4d',
              transition: 'all 0.12s',
            }}>
              {t === 'all' ? 'All' : meta!.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Event list grouped by month */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b5d4d', background: '#fff', borderRadius: 20, border: '1px dashed rgba(184,168,138,0.5)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📅</div>
          <p style={{ fontStyle: 'italic' }}>No events found. Add one above.</p>
        </div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([month, evs]) => {
          const [year, m] = month.split('-');
          const monthLabel = new Date(Number(year), Number(m) - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
          return (
            <div key={month} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: '#6b5d4d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(184,168,138,0.3)' }}>
                {monthLabel}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {evs.map(ev => {
                  const meta = TYPE_META[ev.type as EventType] ?? TYPE_META.liturgy;
                  const dateStr = ev.date ? new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
                  return (
                    <div key={ev._id} style={{
                      background: '#fff', border: '1px solid rgba(184,168,138,0.3)', borderRadius: 14,
                      padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
                      boxShadow: '0 1px 6px rgba(61,53,41,0.05)',
                    }}>
                      {/* Type dot */}
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />

                      {/* Event info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#3d3529', fontSize: '0.92rem' }}>{ev.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b5d4d', marginTop: '0.1rem' }}>
                          {dateStr} · {ev.time}
                          {ev.description && <span style={{ marginLeft: '0.5rem', opacity: 0.75 }}>— {ev.description.slice(0, 70)}{ev.description.length > 70 ? '…' : ''}</span>}
                        </div>
                      </div>

                      {/* Type badge */}
                      <span style={{
                        fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: 999,
                        background: meta.bg, color: meta.color, fontWeight: 700, flexShrink: 0,
                      }}>{meta.label}</span>

                      {/* Actions */}
                      <button onClick={() => startEdit(ev)} style={{
                        padding: '0.35rem 0.9rem', borderRadius: 8, background: 'rgba(200,148,26,0.1)',
                        border: '1px solid rgba(184,134,11,0.3)', color: '#b8860b', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600, flexShrink: 0,
                      }}>Edit</button>
                      <button onClick={() => handleDelete(ev._id!)} style={{
                        padding: '0.35rem 0.9rem', borderRadius: 8, background: 'rgba(122,24,24,0.08)',
                        border: '1px solid rgba(122,24,24,0.2)', color: '#7A1818', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600, flexShrink: 0,
                      }}>Delete</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
