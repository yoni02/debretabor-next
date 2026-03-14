'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import GalleryGrid from '@/components/GalleryGrid';

type Photo = { src: string; caption: string; alt: string };

export type GalleryFolder = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  photo_count: number;
  sort_order: number;
};

const FALLBACK_PHOTOS: Photo[] = [
  { src: '/screenshot-s12.png', caption: 'The Holy Trinity', alt: 'Ethiopian Orthodox icon of the Holy Trinity' },
  { src: '/screenshot-s11.png', caption: 'Virgin Mary & Christ Child', alt: 'Ethiopian Orthodox icon of the Theotokos' },
  { src: '/screenshot-s7.png', caption: 'Congregation Gathering', alt: 'Congregation gathered outside the church' },
  { src: '/screenshot-s2.png', caption: 'Our Church', alt: 'Debre Tabor Church building at dusk' },
  { src: '/screenshot-s5.png', caption: 'Sacred Procession', alt: 'Liturgical procession with priests' },
];

export default function GalleryWithFolders() {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery/folders', { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json();
      return data;
    } catch {
      return [];
    }
  }, []);

  const fetchPhotos = useCallback(async (folderId: string | null) => {
    try {
      const url = folderId
        ? `/api/gallery?folder_id=${encodeURIComponent(folderId)}`
        : '/api/gallery';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      if (!data || data.length === 0) return [];
      const sorted = [...data].sort((a: { sort_order?: number; created_at?: string }, b: { sort_order?: number; created_at?: string }) => {
        const ao = a.sort_order ?? 9999;
        const bo = b.sort_order ?? 9999;
        return ao !== bo ? ao - bo : (a.created_at ?? '').localeCompare(b.created_at ?? '');
      });
      return sorted.map((p: { public_url: string; caption?: string }) => ({
        src: p.public_url,
        caption: p.caption ?? '',
        alt: p.caption || 'Church photo',
      }));
    } catch {
      return [];
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const folderIdForFetch = selectedFolderId === '__all__' || selectedFolderId === null ? null : selectedFolderId;
    const [foldersData, photosData] = await Promise.all([
      fetchFolders(),
      fetchPhotos(folderIdForFetch),
    ]);
    setFolders(foldersData);
    if (photosData.length > 0) {
      setPhotos(photosData);
      setUseFallback(false);
    } else if (selectedFolderId === null) {
      setPhotos(FALLBACK_PHOTOS);
      setUseFallback(true);
    } else {
      setPhotos([]);
      setUseFallback(false);
    }
    setLoading(false);
  }, [fetchFolders, fetchPhotos, selectedFolderId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    const channel = supabase
      .channel('gallery-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_folders' }, loadAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadAll]);

  // When folder selection changes, fetch photos for that folder
  useEffect(() => {
    if (selectedFolderId === null) return;
    let cancelled = false;
    setLoading(true);
    const folderIdForFetch = selectedFolderId === '__all__' ? null : selectedFolderId;
    fetchPhotos(folderIdForFetch).then((p) => {
      if (!cancelled) {
        setPhotos(p.length > 0 ? p : []);
        setUseFallback(p.length === 0 && folderIdForFetch === null);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedFolderId, fetchPhotos]);

  if (loading && folders.length === 0 && photos.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#6b5d4d', fontSize: '1rem' }}>
        Loading gallery…
      </div>
    );
  }

  // No folders: show flat gallery (backward compat)
  if (folders.length === 0) {
    return (
      loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#6b5d4d' }}>Loading…</div>
      ) : (
        <GalleryGrid photos={photos.length > 0 ? photos : FALLBACK_PHOTOS} />
      )
    );
  }

  // Show folder grid when no folder selected
  const showFolderGrid = selectedFolderId === null;

  if (showFolderGrid) {
    return (
      <div className="gallery-folders-section">
        <div className="gallery-folders-grid">
          {/* All Photos card */}
          <button
            type="button"
            className="gallery-folder-card"
            onClick={() => setSelectedFolderId('__all__')}
          >
            <div className="gallery-folder-thumb">
              <Image
                src={photos[0]?.src || '/screenshot-s7.png'}
                alt="All photos"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="gallery-folder-overlay">
                <i className="fas fa-images" />
              </div>
            </div>
            <span className="gallery-folder-title">All Photos</span>
            <span className="gallery-folder-count">{photos.length} photos</span>
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              className="gallery-folder-card"
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <div className="gallery-folder-thumb">
                {folder.thumbnail_url ? (
                  <Image
                    src={folder.thumbnail_url}
                    alt={folder.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="gallery-folder-placeholder">
                    <i className="fas fa-folder" />
                  </div>
                )}
                <div className="gallery-folder-overlay">
                  <i className="fas fa-images" />
                </div>
              </div>
              <span className="gallery-folder-title">{folder.title}</span>
              <span className="gallery-folder-count">{folder.photo_count} photo{folder.photo_count !== 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Folder selected: show photos (or loading)
  const displayPhotos = photos;
  const folderTitle = selectedFolderId === '__all__'
    ? 'All Photos'
    : folders.find((f) => f.id === selectedFolderId)?.title ?? 'Photos';

  return (
    <div className="gallery-photos-section">
      <div className="gallery-photos-header">
        <button
          type="button"
          className="gallery-back-btn"
          onClick={() => setSelectedFolderId(null)}
        >
          <i className="fas fa-arrow-left" /> Back to folders
        </button>
        <h2 className="gallery-photos-title">{folderTitle}</h2>
      </div>
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#6b5d4d' }}>Loading…</div>
      ) : displayPhotos.length === 0 ? (
        <div className="gallery-empty">
          <i className="fas fa-images" />
          <p>No photos in this folder yet.</p>
        </div>
      ) : (
        <GalleryGrid photos={displayPhotos} />
      )}
    </div>
  );
}
