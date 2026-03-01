'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  public_url: string;
  caption: string;
  section: string;
}

export default function AdminGalleryPage() {
  const [photos,    setPhotos]    = useState<Photo[]>([]);
  const [caption,   setCaption]   = useState('');
  const [section,   setSection]   = useState('gallery');
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchPhotos() {
    const res = await fetch('/api/gallery');
    setPhotos(await res.json());
  }

  useEffect(() => { fetchPhotos(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('caption', caption);
      fd.append('section', section);
      const res = await fetch('/api/gallery', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setMsg('Photo uploaded successfully.');
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
      await fetchPhotos();
    } catch (err) {
      setMsg(`Upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo from the website and storage?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (!res.ok) { setMsg('Delete failed.'); return; }
    setMsg('Photo deleted.');
    await fetchPhotos();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1px solid rgba(184,168,138,0.5)', background: '#faf8f5',
    fontSize: '0.9rem', color: '#3d3529', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem',
    color: '#6b5d4d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', color: '#b8860b', marginBottom: '1.5rem' }}>Gallery Manager</h1>

      <form onSubmit={handleUpload} style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20, padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 2px 12px rgba(61,53,41,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Image File</label>
          <input type="file" accept="image/*" ref={fileRef} required style={{ ...inputStyle, padding: '0.5rem' }} />
        </div>
        <div>
          <label style={labelStyle}>Caption</label>
          <input style={inputStyle} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this photo…" />
        </div>
        <div>
          <label style={labelStyle}>Section</label>
          <select style={inputStyle} value={section} onChange={e => setSection(e.target.value)}>
            <option value="gallery">Gallery Page</option>
            <option value="about">About Page</option>
            <option value="home">Home Page</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="submit" disabled={uploading} style={{ padding: '0.7rem 2rem', borderRadius: 999, background: 'linear-gradient(135deg, #c9a227, #b8860b)', color: '#faf8f5', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
          {msg && <span style={{ color: msg.startsWith('Upload failed') ? '#7A1818' : '#b8860b', fontSize: '0.85rem' }}>{msg}</span>}
        </div>
      </form>

      <h2 style={{ fontSize: '1.2rem', color: '#b8860b', marginBottom: '1rem' }}>Uploaded Photos ({photos.length})</h2>
      {photos.length === 0 && <p style={{ color: '#6b5d4d', fontStyle: 'italic' }}>No photos uploaded yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ background: 'rgba(255,252,248,0.95)', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(61,53,41,0.06)' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3' }}>
              <Image src={photo.public_url} alt={photo.caption} fill style={{ objectFit: 'cover' }} sizes="220px" />
            </div>
            <div style={{ padding: '0.75rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#3d3529', marginBottom: '0.2rem', fontWeight: 600 }}>{photo.caption || '(no caption)'}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b5d4d', marginBottom: '0.6rem' }}>Section: {photo.section}</p>
              <button onClick={() => handleDelete(photo.id)} style={{ width: '100%', padding: '0.4rem', borderRadius: 8, background: 'rgba(122,24,24,0.08)', border: '1px solid rgba(122,24,24,0.2)', color: '#7A1818', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
