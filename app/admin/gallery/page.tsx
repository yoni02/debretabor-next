'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  public_url: string;
  caption: string;
  section: string;
  sort_order?: number;
}

const I = (style: React.CSSProperties = {}): React.CSSProperties => ({
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
  border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5',
  fontSize: '0.88rem', color: '#3d3529', boxSizing: 'border-box', ...style,
});

const LABEL: React.CSSProperties = {
  display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem',
  color: '#6b5d4d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
};

const SECTIONS = ['gallery', 'about', 'home', 'ministries'];

export default function AdminGalleryPage() {
  const [photos, setPhotos]       = useState<Photo[]>([]);
  const [caption, setCaption]     = useState('');
  const [section, setSection]     = useState('gallery');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]             = useState('');
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editCaptionId, setEditCaptionId] = useState<string | null>(null);
  const [editCaptionVal, setEditCaptionVal] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const fileRef    = useRef<HTMLInputElement>(null);
  const dragIdx    = useRef<number | null>(null);
  const dragOver   = useRef<number | null>(null);

  const fetchPhotos = useCallback(async () => {
    const res = await fetch('/api/gallery');
    const data: Photo[] = await res.json();
    setPhotos(data.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  // ── Upload ──────────────────────────────────────────────────────────────
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true); setMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('caption', caption);
      fd.append('section', section);
      const res = await fetch('/api/gallery', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setMsg('✓ Photo uploaded.');
      setCaption(''); setSection('gallery');
      if (fileRef.current) fileRef.current.value = '';
      setShowUpload(false);
      await fetchPhotos();
    } catch (err) {
      setMsg(`✗ ${err instanceof Error ? err.message : 'Upload failed'}`);
    }
    setUploading(false);
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this photo?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (!res.ok) { setMsg('✗ Delete failed.'); return; }
    setMsg('✓ Photo deleted.');
    await fetchPhotos();
    setOrderDirty(false);
  }

  // ── Caption edit ─────────────────────────────────────────────────────────
  async function saveCaption(id: string) {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: editCaptionVal }),
    });
    if (!res.ok) { setMsg('✗ Caption save failed.'); return; }
    setEditCaptionId(null);
    setMsg('✓ Caption saved.');
    await fetchPhotos();
  }

  // ── Drag to reorder ──────────────────────────────────────────────────────
  function onDragStart(idx: number) { dragIdx.current = idx; }
  function onDragEnter(idx: number) { dragOver.current = idx; }

  function onDragEnd() {
    const from = dragIdx.current;
    const to   = dragOver.current;
    if (from === null || to === null || from === to) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPhotos(next);
    setOrderDirty(true);
    dragIdx.current  = null;
    dragOver.current = null;
  }

  async function saveOrder() {
    setSavingOrder(true); setMsg('');
    try {
      await Promise.all(
        photos.map((p, i) =>
          fetch(`/api/gallery/${p.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sort_order: i }),
          })
        )
      );
      setMsg('✓ Order saved.');
      setOrderDirty(false);
    } catch {
      setMsg('✗ Failed to save order.');
    }
    setSavingOrder(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', color: '#b8860b', margin: 0 }}>Gallery Manager</h1>
          <p style={{ color: '#6b5d4d', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} · Drag to reorder · Click caption to edit
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {msg && (
            <span style={{ fontSize: '0.85rem', color: msg.startsWith('✓') ? '#2d6a2d' : '#7A1818', fontWeight: 600 }}>{msg}</span>
          )}
          {orderDirty && (
            <button onClick={saveOrder} disabled={savingOrder} style={{
              padding: '0.6rem 1.4rem', borderRadius: 999,
              background: 'linear-gradient(135deg,#c9a227,#b8860b)', color: '#faf8f5',
              fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            }}>
              {savingOrder ? 'Saving…' : '↕ Save Order'}
            </button>
          )}
          <button onClick={() => setShowUpload(v => !v)} style={{
            padding: '0.6rem 1.4rem', borderRadius: 999,
            background: showUpload ? 'rgba(184,168,138,0.2)' : '#130804',
            color: showUpload ? '#6b5d4d' : '#C8941A',
            border: '1px solid ' + (showUpload ? 'rgba(184,168,138,0.4)' : '#C8941A'),
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            {showUpload ? '✕ Cancel' : '+ Upload Photo'}
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showUpload && (
        <form onSubmit={handleUpload} style={{
          background: '#fff', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20,
          padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(61,53,41,0.07)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
        }}>
          <h2 style={{ gridColumn: '1 / -1', fontSize: '1rem', color: '#b8860b', margin: 0, paddingBottom: '0.25rem', borderBottom: '1px solid rgba(184,168,138,0.25)' }}>
            Upload New Photo
          </h2>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={LABEL}>Image File</label>
            <input type="file" accept="image/*" ref={fileRef} required style={I({ padding: '0.45rem' })} />
          </div>
          <div>
            <label style={LABEL}>Caption</label>
            <input style={I()} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this photo…" />
          </div>
          <div>
            <label style={LABEL}>Section</label>
            <select style={I()} value={section} onChange={e => setSection(e.target.value)}>
              {SECTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Page</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={uploading} style={{
              padding: '0.7rem 2rem', borderRadius: 999,
              background: 'linear-gradient(135deg,#c9a227,#b8860b)', color: '#faf8f5',
              fontWeight: 700, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', opacity: uploading ? 0.7 : 1,
            }}>
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>
          </div>
        </form>
      )}

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b5d4d', background: '#fff', borderRadius: 20, border: '1px dashed rgba(184,168,138,0.5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <p style={{ fontStyle: 'italic' }}>No photos yet. Click &ldquo;Upload Photo&rdquo; to add your first image.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnter={() => onDragEnter(idx)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              style={{
                background: '#fff', border: '1px solid rgba(184,168,138,0.35)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(61,53,41,0.07)',
                cursor: 'grab', userSelect: 'none',
                transition: 'box-shadow 0.15s',
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#ece6da' }}>
                <Image src={photo.public_url} alt={photo.caption || 'photo'} fill
                  style={{ objectFit: 'cover' }} sizes="240px" />
                {/* Order badge */}
                <div style={{
                  position: 'absolute', top: 8, left: 8, background: 'rgba(19,8,4,0.75)',
                  color: '#C8941A', borderRadius: 6, padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem', fontWeight: 700,
                }}>#{idx + 1}</div>
                {/* Drag handle */}
                <div style={{
                  position: 'absolute', top: 8, right: 8, background: 'rgba(19,8,4,0.6)',
                  color: '#d4b483', borderRadius: 6, padding: '0.25rem 0.4rem', fontSize: '0.75rem',
                }}>⠿</div>
              </div>

              {/* Info */}
              <div style={{ padding: '0.75rem' }}>
                {/* Caption */}
                {editCaptionId === photo.id ? (
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <input
                      autoFocus
                      value={editCaptionVal}
                      onChange={e => setEditCaptionVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveCaption(photo.id); if (e.key === 'Escape') setEditCaptionId(null); }}
                      style={I({ padding: '0.4rem 0.6rem', fontSize: '0.8rem', flex: 1, minWidth: 0 })}
                    />
                    <button onClick={() => saveCaption(photo.id)} style={{
                      padding: '0.3rem 0.6rem', borderRadius: 8, background: '#b8860b',
                      color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                    }}>✓</button>
                    <button onClick={() => setEditCaptionId(null)} style={{
                      padding: '0.3rem 0.5rem', borderRadius: 8, background: 'rgba(184,168,138,0.2)',
                      color: '#6b5d4d', border: '1px solid rgba(184,168,138,0.4)', cursor: 'pointer', fontSize: '0.75rem',
                    }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditCaptionId(photo.id); setEditCaptionVal(photo.caption || ''); }}
                    title="Click to edit caption"
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: 'none', border: 'none', padding: '0.3rem 0.4rem',
                      marginBottom: '0.4rem', borderRadius: 6, cursor: 'text',
                      fontSize: '0.82rem', color: photo.caption ? '#3d3529' : '#9b8e80',
                      fontStyle: photo.caption ? 'normal' : 'italic',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,168,138,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    ✏️ {photo.caption || 'Add caption…'}
                  </button>
                )}

                {/* Section badge + delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 999,
                    background: 'rgba(200,148,26,0.12)', color: '#b8860b', fontWeight: 600,
                    textTransform: 'capitalize',
                  }}>{photo.section}</span>
                  <button onClick={() => handleDelete(photo.id)} style={{
                    padding: '0.3rem 0.7rem', borderRadius: 8, fontSize: '0.75rem',
                    background: 'rgba(122,24,24,0.08)', border: '1px solid rgba(122,24,24,0.2)',
                    color: '#7A1818', cursor: 'pointer', fontWeight: 600,
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
