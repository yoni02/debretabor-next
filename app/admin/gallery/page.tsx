'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  public_url: string;
  caption: string;
  section: string;
  folder_id?: string | null;
  sort_order?: number;
  created_at?: string;
}

interface Folder {
  id: string;
  title: string;
  thumbnail_url: string | null;
  photo_count: number;
  sort_order: number;
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
  const [folderId, setFolderId] = useState<string>('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showFolders, setShowFolders] = useState(false);
  const [folderTitle, setFolderTitle] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderTitle, setEditingFolderTitle] = useState('');

  const fileRef    = useRef<HTMLInputElement>(null);
  const dragIdx    = useRef<number | null>(null);
  const dragOver   = useRef<number | null>(null);

  const [seeding, setSeeding] = useState(false);

  const fetchPhotos = useCallback(async () => {
    const res = await fetch('/api/gallery');
    const data: Photo[] = await res.json();
    setPhotos(data.sort((a, b) => {
      const ao = a.sort_order ?? 9999;
      const bo = b.sort_order ?? 9999;
      return ao !== bo ? ao - bo : (a.created_at ?? '').localeCompare(b.created_at ?? '');
    }));
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data);
      }
    } catch {
      setFolders([]);
    }
  }, []);

  async function seedDefaults() {
    if (!confirm('This will add all default church photos to the database. Continue?')) return;
    setSeeding(true); setMsg('');
    try {
      const res = await fetch('/api/admin/seed-gallery', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Seed failed');
      setMsg(json.inserted ? `Added ${json.inserted} default photos.` : json.message);
      await fetchPhotos();
    } catch (err) {
      setMsg(`Error: ${err instanceof Error ? err.message : 'Seed failed'}`);
    }
    setSeeding(false);
  }

  useEffect(() => { fetchPhotos(); fetchFolders(); }, [fetchPhotos, fetchFolders]);

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
      if (folderId) fd.append('folder_id', folderId);
      const res = await fetch('/api/gallery', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setMsg('Photo uploaded.');
      setCaption(''); setSection('gallery'); setFolderId('');
      if (fileRef.current) fileRef.current.value = '';
      setShowUpload(false);
      await fetchPhotos();
    } catch (err) {
      setMsg(`Error: ${err instanceof Error ? err.message : 'Upload failed'}`);
    }
    setUploading(false);
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this photo?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (!res.ok) { setMsg('Error: Delete failed.'); return; }
    setMsg('Photo deleted.');
    await fetchPhotos();
    await fetchFolders();
    setOrderDirty(false);
  }

  // ── Caption edit ─────────────────────────────────────────────────────────
  async function saveCaption(id: string) {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: editCaptionVal }),
    });
    if (!res.ok) { setMsg('Error: Caption save failed.'); return; }
    setEditCaptionId(null);
    setMsg('Caption saved.');
    await fetchPhotos();
    await fetchFolders();
  }

  async function savePhotoFolder(photoId: string, newFolderId: string | null) {
    const res = await fetch(`/api/gallery/${photoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_id: newFolderId || null }),
    });
    if (!res.ok) { setMsg('Error: Save failed.'); return; }
    setMsg('Folder updated.');
    await fetchPhotos();
    await fetchFolders();
  }

  async function createFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!folderTitle.trim()) return;
    setMsg('');
    try {
      const res = await fetch('/api/gallery/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: folderTitle.trim(), sort_order: folders.length }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setFolderTitle('');
      setShowFolders(false);
      setMsg('Folder created.');
      await fetchFolders();
    } catch (err) {
      setMsg(`Error: ${err instanceof Error ? err.message : 'Create failed'}`);
    }
  }

  async function updateFolder(id: string) {
    if (!editingFolderTitle.trim()) return;
    setMsg('');
    try {
      const res = await fetch(`/api/gallery/folders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingFolderTitle.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setEditingFolderId(null);
      setEditingFolderTitle('');
      setMsg('Folder updated.');
      await fetchFolders();
    } catch (err) {
      setMsg(`Error: ${err instanceof Error ? err.message : 'Update failed'}`);
    }
  }

  async function deleteFolder(id: string) {
    if (!confirm('Delete this folder? Photos will become uncategorized.')) return;
    setMsg('');
    try {
      const res = await fetch(`/api/gallery/folders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setMsg('Folder deleted.');
      await fetchPhotos();
      await fetchFolders();
    } catch {
      setMsg('Error: Delete failed.');
    }
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
      setMsg('Order saved.');
      setOrderDirty(false);
    } catch {
      setMsg('Error: Failed to save order.');
    }
    setSavingOrder(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <h1 style={{ fontSize: '1.7rem', color: '#b8860b', margin: 0 }}>Gallery Manager</h1>
          <p style={{ color: '#6b5d4d', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} · Drag to reorder · Click caption to edit
          </p>
        </div>
        <div className="admin-header-buttons">
          {msg && (
            <span style={{ fontSize: '0.85rem', color: msg.startsWith('Error') ? '#7A1818' : '#2d6a2d', fontWeight: 600 }}>{msg}</span>
          )}
          {orderDirty && (
            <button onClick={saveOrder} disabled={savingOrder} style={{
              padding: '0.6rem 1.4rem', borderRadius: 999,
              background: 'linear-gradient(135deg,#c9a227,#b8860b)', color: '#faf8f5',
              fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            }}>
              <i className="fas fa-arrows-up-down" style={{ marginRight: 6 }} />{savingOrder ? 'Saving…' : 'Save Order'}
            </button>
          )}
          {photos.length === 0 && (
            <button onClick={seedDefaults} disabled={seeding} title="Populate the database with all default church photos" style={{
              padding: '0.6rem 1.4rem', borderRadius: 999,
              background: 'rgba(26,52,120,0.1)', color: '#1A3478',
              border: '1px solid rgba(26,52,120,0.35)',
              fontWeight: 700, cursor: seeding ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
              opacity: seeding ? 0.7 : 1,
            }}>
              <i className="fas fa-download" style={{ marginRight: 6 }} />{seeding ? 'Initializing…' : 'Initialize Default Photos'}
            </button>
          )}
          <button onClick={() => setShowFolders(v => !v)} style={{
            padding: '0.6rem 1.4rem', borderRadius: 999,
            background: showFolders ? 'rgba(26,52,120,0.2)' : 'rgba(26,52,120,0.1)',
            color: '#1A3478',
            border: '1px solid rgba(26,52,120,0.35)',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            <i className={`fas ${showFolders ? 'fa-times' : 'fa-folder'}`} style={{ marginRight: 4 }} />{showFolders ? 'Close' : 'Manage Folders'}
          </button>
          <button onClick={() => setShowUpload(v => !v)} style={{
            padding: '0.6rem 1.4rem', borderRadius: 999,
            background: showUpload ? 'rgba(184,168,138,0.2)' : '#130804',
            color: showUpload ? '#6b5d4d' : '#C8941A',
            border: '1px solid ' + (showUpload ? 'rgba(184,168,138,0.4)' : '#C8941A'),
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            <i className={`fas ${showUpload ? 'fa-times' : 'fa-plus'}`} style={{ marginRight: 4 }} />{showUpload ? 'Cancel' : 'Upload Photo'}
          </button>
        </div>
      </div>

      {/* Folder management */}
      {showFolders && (
        <div style={{
          background: '#fff', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20,
          padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(61,53,41,0.07)',
        }}>
          <h2 style={{ fontSize: '1rem', color: '#b8860b', margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(184,168,138,0.25)' }}>
            Gallery Folders
          </h2>
          <form onSubmit={createFolder} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input style={I({ flex: '1 1 200px', minWidth: 0 })} value={folderTitle} onChange={e => setFolderTitle(e.target.value)} placeholder="New folder title…" />
            <button type="submit" disabled={!folderTitle.trim()} style={{
              padding: '0.5rem 1.2rem', borderRadius: 999, background: '#1A3478', color: '#fff',
              fontWeight: 700, border: 'none', cursor: folderTitle.trim() ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem', opacity: folderTitle.trim() ? 1 : 0.6,
            }}><i className="fas fa-plus" style={{ marginRight: 4 }} />Create Folder</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {folders.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.8rem', background: 'rgba(184,168,138,0.08)', borderRadius: 10 }}>
                {editingFolderId === f.id ? (
                  <>
                    <input style={I({ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' })} value={editingFolderTitle} onChange={e => setEditingFolderTitle(e.target.value)} autoFocus />
                    <button onClick={() => updateFolder(f.id)} style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: '#b8860b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-check" /></button>
                    <button onClick={() => { setEditingFolderId(null); setEditingFolderTitle(''); }} style={{ padding: '0.3rem 0.5rem', borderRadius: 8, background: 'rgba(184,168,138,0.2)', border: '1px solid rgba(184,168,138,0.4)', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-times" /></button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontWeight: 600, color: '#3d3529' }}>{f.title}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b5d4d' }}>{f.photo_count} photo{f.photo_count !== 1 ? 's' : ''}</span>
                    <button onClick={() => { setEditingFolderId(f.id); setEditingFolderTitle(f.title); }} style={{ padding: '0.25rem 0.5rem', borderRadius: 6, background: 'none', border: '1px solid rgba(184,168,138,0.4)', cursor: 'pointer', fontSize: '0.75rem', color: '#6b5d4d' }} title="Edit"><i className="fas fa-pen" /></button>
                    <button onClick={() => deleteFolder(f.id)} style={{ padding: '0.25rem 0.5rem', borderRadius: 6, background: 'rgba(122,24,24,0.08)', border: '1px solid rgba(122,24,24,0.2)', cursor: 'pointer', fontSize: '0.75rem', color: '#7A1818' }} title="Delete"><i className="fas fa-trash" /></button>
                  </>
                )}
              </div>
            ))}
            {folders.length === 0 && <p style={{ color: '#6b5d4d', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No folders yet. Create one to organize photos by category or event.</p>}
          </div>
        </div>
      )}

      {/* Upload form */}
      {showUpload && (
        <form onSubmit={handleUpload} style={{
          background: '#fff', border: '1px solid rgba(184,168,138,0.35)', borderRadius: 20,
          padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(61,53,41,0.07)',
        }} className="admin-form-grid">
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
          <div>
            <label style={LABEL}>Folder</label>
            <select style={I()} value={folderId} onChange={e => setFolderId(e.target.value)}>
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#b8860b' }}><i className="fas fa-images" /></div>
          <p style={{ fontStyle: 'italic' }}>No photos yet. Click &ldquo;Upload Photo&rdquo; to add your first image.</p>
        </div>
      ) : (
        <div className="admin-gallery-grid">
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
                }}><i className="fas fa-grip-vertical" /></div>
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
                    }}><i className="fas fa-check" /></button>
                    <button onClick={() => setEditCaptionId(null)} style={{
                      padding: '0.3rem 0.5rem', borderRadius: 8, background: 'rgba(184,168,138,0.2)',
                      color: '#6b5d4d', border: '1px solid rgba(184,168,138,0.4)', cursor: 'pointer', fontSize: '0.75rem',
                    }}><i className="fas fa-times" /></button>
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
                    <i className="fas fa-pen" style={{ marginRight: 6, opacity: 0.7 }} />{photo.caption || 'Add caption…'}
                  </button>
                )}

                {/* Folder + Section + delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <select
                      value={photo.folder_id ?? ''}
                      onChange={e => savePhotoFolder(photo.id, e.target.value || null)}
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 6, border: '1px solid rgba(184,168,138,0.4)', background: '#faf8f5', color: '#3d3529', cursor: 'pointer', maxWidth: 120 }}
                    >
                      <option value="">No folder</option>
                      {folders.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                    </select>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 999,
                      background: 'rgba(200,148,26,0.12)', color: '#b8860b', fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{photo.section}</span>
                  </div>
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
